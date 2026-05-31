'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById } from '@/lib/actions/products';
import { Product } from '@/lib/types';

export default function EditProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (params.id) {
        const p = await getProductById(params.id as string);
        setProduct(p);
      }
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-stone-200 animate-pulse rounded" />
        <div className="h-4 w-64 bg-stone-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-10 bg-stone-100 animate-pulse rounded" />
            <div className="h-10 bg-stone-100 animate-pulse rounded" />
            <div className="h-10 bg-stone-100 animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            <div className="h-24 bg-stone-100 animate-pulse rounded" />
            <div className="h-10 bg-stone-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-light text-stone-900 mb-2">Product Not Found</h1>
        <p className="text-sm text-stone-500">The product you are trying to edit does not exist.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-stone-900">Edit Product</h1>
        <p className="text-sm text-stone-500 mt-1">Update product details</p>
      </div>
      <ProductForm product={product} mode="edit" />
    </div>
  );
}
