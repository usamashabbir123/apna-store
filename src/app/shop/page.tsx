'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { products as localProducts, categories } from '@/data/products';
import { getProducts } from '@/lib/actions/products';
import { Product } from '@/lib/types';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get('category') || 'all';

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state with URL changes
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts(activeCategory === 'all' ? undefined : activeCategory);
        setProducts(data.length > 0 ? data : localProducts);
      } catch {
        setProducts(localProducts);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [activeCategory]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      router.push('/shop');
    } else {
      router.push(`/shop?category=${catId}`);
    }
  };

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    return result;
  }, [products, activeCategory, sortBy]);

  return (
    <>
      <div className="bg-muted py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-light text-foreground mb-3">Shop</h1>
          <p className="text-muted-foreground text-sm">Discover our curated collection of modern and traditional fashion.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-4 py-2 text-xs tracking-wide uppercase transition-colors border ${
                  activeCategory === cat.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-muted-foreground'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-sm text-foreground border border-border px-3 py-2 bg-background focus:outline-none focus:border-muted-foreground"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6">
          Showing {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-secondary animate-pulse" />
                <div className="h-4 w-3/4 bg-secondary animate-pulse" />
                <div className="h-3 w-1/2 bg-secondary animate-pulse" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-sm">No products found in this category.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="bg-muted py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-32 bg-secondary animate-pulse rounded mb-3" />
          <div className="h-4 w-64 bg-secondary animate-pulse rounded" />
        </div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
