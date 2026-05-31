'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import Image from 'next/image';

interface ProductFormProps {
  product?: Product;
  mode: 'create' | 'edit';
}

const CATEGORIES = ['men', 'women', 'traditional', 'accessories'];
const BADGES = ['', 'Best Seller', 'New Arrival', 'Limited', 'Sale', 'Bridal'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '6', '7', '8', '9', '10', '11'];

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  type Category = 'men' | 'women' | 'traditional' | 'accessories';

  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    originalPrice: product?.originalPrice?.toString() || '',
    category: (product?.category || 'men') as Category,
    description: product?.description || '',
    badge: product?.badge || '',
    inStock: product?.inStock ?? true,
    sizes: product?.sizes || [],
  });

  const [colors, setColors] = useState<{ name: string; class: string }[]>(
    product?.colors || []
  );

  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const data = new FormData();
    data.set('name', form.name);
    data.set('price', form.price);
    data.set('originalPrice', form.originalPrice);
    data.set('category', form.category);
    data.set('description', form.description);
    data.set('badge', form.badge);
    data.set('inStock', form.inStock.toString());
    data.set('sizes', JSON.stringify(form.sizes));
    data.set('colors', JSON.stringify(colors));
    data.set('deletedImages', JSON.stringify(deletedImages));

    newFiles.forEach((f) => data.append('images', f));

    try {
      let result;
      if (mode === 'create') {
        const { createProduct } = await import('@/lib/actions/products');
        result = await createProduct(data);
      } else {
        const { updateProduct } = await import('@/lib/actions/products');
        result = await updateProduct(product!.id, data);
      }

      if (result.success) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const toggleSize = (size: string) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const addColor = () => {
    setColors([...colors, { name: '', class: '' }]);
  };

  const updateColor = (idx: number, field: 'name' | 'class', value: string) => {
    setColors((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c))
    );
  };

  const removeColor = (idx: number) => {
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length - deletedImages.length + newFiles.length + files.length;
    if (totalImages > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((f) => URL.createObjectURL(f));
    setNewPreviews((prev) => [...prev, ...previews]);
  };

  const removeExistingImage = (url: string) => {
    setDeletedImages((prev) => [...prev, url]);
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const removeNewFile = (idx: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const visibleExisting = existingImages.filter((u) => !deletedImages.includes(u));
  const totalVisible = visibleExisting.length + newFiles.length;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm rounded-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column — Basic Info */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 transition-colors"
              placeholder="e.g. Ivory Linen Kurta"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Price (PKR) *</label>
              <input
                type="number"
                required
                min={0}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="4500"
              />
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Original Price</label>
              <input
                type="number"
                min={0}
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="5500 (for sale)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as 'men' | 'women' | 'traditional' | 'accessories' })}
                className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Badge</label>
              <select
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 bg-white"
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>{b || 'None'}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, inStock: !form.inStock })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.inStock ? 'bg-stone-900' : 'bg-stone-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.inStock ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-stone-700">{form.inStock ? 'In Stock' : 'Out of Stock'}</span>
          </div>
        </div>

        {/* Right Column — Details */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs tracking-wide uppercase text-stone-500 mb-1.5">Description *</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500 transition-colors resize-none"
              placeholder="Describe the product..."
            />
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-xs tracking-wide uppercase text-stone-500 mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1.5 text-xs border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs tracking-wide uppercase text-stone-500">Colors</label>
              <button type="button" onClick={addColor} className="text-xs text-stone-500 hover:text-stone-900 underline">
                + Add Color
              </button>
            </div>
            <div className="space-y-2">
              {colors.map((color, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColor(idx, 'name', e.target.value)}
                    placeholder="Color name"
                    className="flex-1 px-3 py-1.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
                  />
                  <input
                    type="text"
                    value={color.class}
                    onChange={(e) => updateColor(idx, 'class', e.target.value)}
                    placeholder="Tailwind class"
                    className="flex-1 px-3 py-1.5 border border-stone-200 text-sm focus:outline-none focus:border-stone-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(idx)}
                    className="text-stone-400 hover:text-red-500 text-xs px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="border-t border-stone-100 pt-6">
        <label className="block text-xs tracking-wide uppercase text-stone-500 mb-3">Images ({totalVisible}/5)</label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
          {visibleExisting.map((url, idx) => (
            <div key={url} className="relative aspect-square bg-stone-100 overflow-hidden group">
              <Image src={url} alt={`Product image ${idx + 1}`} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
          {newPreviews.map((url, idx) => (
            <div key={`new-${idx}`} className="relative aspect-square bg-stone-100 overflow-hidden group">
              <Image src={url} alt={`New image ${idx + 1}`} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => removeNewFile(idx)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
              <span className="absolute bottom-1 left-1 text-[10px] bg-stone-900 text-white px-1.5 py-0.5">New</span>
            </div>
          ))}
        </div>

        {totalVisible < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 border border-dashed border-stone-300 text-stone-500 text-sm hover:border-stone-500 hover:text-stone-700 transition-colors"
          >
            + Upload Images
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4 border-t border-stone-100">
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 bg-stone-900 text-white text-sm tracking-wide uppercase hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Update Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-3 border border-stone-200 text-stone-600 text-sm hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
