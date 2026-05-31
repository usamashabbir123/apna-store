'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import QuickViewModal from './QuickViewModal';
import { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  subtitle?: string;
}

export default function ProductGrid({ products, title, subtitle }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground text-sm">No products found.</p>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center mb-12 lg:mb-16">
            {title && (
              <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-3">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-muted-foreground text-sm max-w-md mx-auto">{subtitle}</p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-x-6 sm:gap-y-10">
          {products.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              {/* Quick View button */}
              <button
                onClick={() => setQuickViewProduct(product)}
                className="absolute top-2 right-2 z-10 w-8 h-8 bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity shadow-sm text-foreground"
                aria-label="Quick view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
}
