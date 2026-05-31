'use server';

import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { Product } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// ─── READ ACTIONS (public-safe) ───────────────────────────────

export async function getProducts(category?: string): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return (data || []).map(mapProductRow);
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching product:', error);
    return null;
  }

  return mapProductRow(data);
}

// ─── WRITE ACTIONS (admin only — uses service role) ────────────

export async function createProduct(formData: FormData): Promise<{ success: boolean; productId?: string; error?: string }> {
  try {
    const id = crypto.randomUUID();
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string);
    const originalPriceRaw = formData.get('originalPrice') as string;
    const originalPrice = originalPriceRaw ? parseInt(originalPriceRaw) : null;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const badge = (formData.get('badge') as string) || null;
    const inStock = formData.get('inStock') === 'true';
    const sizesJson = formData.get('sizes') as string;
    const colorsJson = formData.get('colors') as string;
    const sizes = sizesJson ? JSON.parse(sizesJson) : [];
    const colors = colorsJson ? JSON.parse(colorsJson) : [];

    // Handle image uploads
    const imageFiles: File[] = [];
    formData.getAll('images').forEach((f) => {
      if (f instanceof File && f.size > 0) imageFiles.push(f);
    });

    const imageUrls = await uploadProductImages(id, imageFiles);
    const primaryImage = imageUrls[0] || '/images/placeholder.jpg';

    const { error } = await supabaseAdmin.from('products').insert({
      id,
      name,
      price,
      original_price: originalPrice,
      category,
      image: primaryImage,
      images: imageUrls,
      description,
      sizes,
      colors,
      badge,
      in_stock: inStock,
    });

    if (error) {
      console.error('Create product error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/shop');
    revalidatePath('/');
    return { success: true, productId: id };
  } catch (err: any) {
    console.error('Create product exception:', err);
    return { success: false, error: err.message };
  }
}

export async function updateProduct(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const name = formData.get('name') as string;
    const price = parseInt(formData.get('price') as string);
    const originalPriceRaw = formData.get('originalPrice') as string;
    const originalPrice = originalPriceRaw ? parseInt(originalPriceRaw) : null;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const badge = (formData.get('badge') as string) || null;
    const inStock = formData.get('inStock') === 'true';
    const sizesJson = formData.get('sizes') as string;
    const colorsJson = formData.get('colors') as string;
    const sizes = sizesJson ? JSON.parse(sizesJson) : [];
    const colors = colorsJson ? JSON.parse(colorsJson) : [];

    // Get existing product to know current images
    const { data: existing } = await supabaseAdmin.from('products').select('images').eq('id', id).single();
    let imageUrls = existing?.images || [];

    // Handle new image uploads
    const imageFiles: File[] = [];
    formData.getAll('images').forEach((f) => {
      if (f instanceof File && f.size > 0) imageFiles.push(f);
    });

    if (imageFiles.length > 0) {
      const newUrls = await uploadProductImages(id, imageFiles);
      imageUrls = [...imageUrls, ...newUrls];
    }

    // Handle deleted images
    const deletedImagesJson = formData.get('deletedImages') as string;
    if (deletedImagesJson) {
      const deletedUrls: string[] = JSON.parse(deletedImagesJson);
      for (const url of deletedUrls) {
        await deleteStorageFile(url);
      }
      imageUrls = imageUrls.filter((u: string) => !deletedUrls.includes(u));
    }

    const primaryImage = imageUrls[0] || '/images/placeholder.jpg';

    const { error } = await supabaseAdmin.from('products').update({
      name,
      price,
      original_price: originalPrice,
      category,
      image: primaryImage,
      images: imageUrls,
      description,
      sizes,
      colors,
      badge,
      in_stock: inStock,
    }).eq('id', id);

    if (error) {
      console.error('Update product error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath(`/product/${id}`);
    return { success: true };
  } catch (err: any) {
    console.error('Update product exception:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteProduct(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Get images to delete from storage
    const { data } = await supabaseAdmin.from('products').select('images').eq('id', id).single();
    const images: string[] = data?.images || [];

    for (const url of images) {
      await deleteStorageFile(url);
    }

    const { error } = await supabaseAdmin.from('products').delete().eq('id', id);

    if (error) {
      console.error('Delete product error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/shop');
    revalidatePath('/');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    console.error('Delete product exception:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleProductStock(id: string, inStock: boolean): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({ in_stock: inStock })
    .eq('id', id);

  if (error) {
    console.error('Error updating product stock:', error);
    return false;
  }

  revalidatePath('/shop');
  return true;
}

// ─── HELPERS ───────────────────────────────────────────────────

function mapProductRow(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    originalPrice: data.original_price,
    category: data.category,
    image: data.image,
    images: data.images || [data.image],
    description: data.description,
    sizes: data.sizes || [],
    colors: (data.colors as any[])?.map((c: any) => ({
      name: c.name,
      class: c.class,
    })) || [],
    badge: data.badge || undefined,
    inStock: data.in_stock,
  };
}

async function uploadProductImages(productId: string, files: File[]): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${productId}/${Date.now()}-${i}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('products')
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      console.error('Image upload error:', uploadError);
      continue;
    }

    const { data: urlData } = supabaseAdmin.storage.from('products').getPublicUrl(path);
    urls.push(urlData.publicUrl);
  }

  return urls;
}

async function deleteStorageFile(url: string): Promise<void> {
  try {
    const bucket = 'products';
    const path = url.split(`/storage/v1/object/public/${bucket}/`)[1];
    if (path) {
      await supabaseAdmin.storage.from(bucket).remove([path]);
    }
  } catch (err) {
    console.error('Failed to delete storage file:', err);
  }
}
