'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getProducts, deleteProduct } from '@/lib/actions/products';
import { Product } from '@/lib/types';

export default function AdminProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    const result = await deleteProduct(id);
    setDeletingId(null);
    if (result.success) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert(result.error || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-light text-stone-900">Products</h1>
          <p className="text-sm text-stone-500 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="px-4 py-2 border border-stone-200 text-sm focus:outline-none focus:border-stone-400 w-full sm:w-64"
          />
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-stone-900 text-white text-sm tracking-wide uppercase hover:bg-stone-800 transition-colors whitespace-nowrap"
          >
            + New
          </Link>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8">
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-stone-100 animate-pulse rounded" />
                      ))}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 bg-stone-100 flex-shrink-0 overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-stone-900 font-medium">{product.name}</p>
                          {product.badge && (
                            <span className="text-[10px] tracking-wide uppercase text-stone-400">{product.badge}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 capitalize text-stone-600">{product.category}</td>
                    <td className="px-6 py-3">
                      <span className="text-stone-900">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-stone-400 line-through ml-2 text-xs">{formatPrice(product.originalPrice)}</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-block px-2 py-0.5 text-[10px] tracking-wide uppercase ${
                        product.inStock
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="text-xs text-stone-600 hover:text-stone-900 underline underline-offset-2"
                        >
                          Edit
                        </Link>
                        <a
                          href={`/product/${product.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 disabled:opacity-50"
                        >
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 text-sm">No products found.</p>
          </div>
        )}
      </div>

      {!loading && (
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span>Showing {filtered.length} of {products.length} products</span>
        </div>
      )}
    </div>
  );
}
