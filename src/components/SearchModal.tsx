'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/lib/actions/products';
import { products as localProducts } from '@/data/products';
import { Product } from '@/lib/types';

export default function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load all products once
  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setAllProducts(data.length > 0 ? data : localProducts);
    }
    load();
  }, []);

  // Command+K to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const q = query.toLowerCase();
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 6));
    setLoading(false);
  }, [query, allProducts]);

  const handleSelect = useCallback(
    (id: string) => {
      setIsOpen(false);
      router.push(`/product/${id}`);
    },
    [router]
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-sm text-xs text-muted-foreground hover:border-muted-foreground transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        Search
        <kbd className="ml-1 px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono text-muted-foreground">⌘K</kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-xl bg-background rounded-sm shadow-2xl overflow-hidden mx-4 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="flex-1 text-sm outline-none placeholder:text-muted-foreground bg-transparent text-foreground"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {loading && (
                  <div className="px-4 py-8 text-center">
                    <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto" />
                  </div>
                )}

                {!loading && query.trim() && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No products found for &quot;{query}&quot;
                  </div>
                )}

                {!query.trim() && (
                  <div className="px-4 py-6 text-center text-muted-foreground/70 text-sm">
                    Start typing to search products...
                  </div>
                )}

                {results.map((product, idx) => (
                  <motion.button
                    key={product.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    onClick={() => handleSelect(product.id)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors text-left border-b border-border/50 last:border-0"
                  >
                    <div className="relative w-12 h-14 bg-secondary flex-shrink-0 overflow-hidden rounded-sm">
                      <Image src={product.image} alt={product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                    </div>
                    <span className="text-sm text-foreground font-medium">{formatPrice(product.price)}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
