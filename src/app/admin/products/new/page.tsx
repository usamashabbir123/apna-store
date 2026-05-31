'use client';

import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-stone-900">New Product</h1>
        <p className="text-sm text-stone-500 mt-1">Add a new product to your store</p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}
