'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const canAdd = selectedSize && selectedColor;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-background w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[400px] bg-secondary">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{product.category}</p>
                  <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                  </button>
                </div>

                <h2 className="text-xl font-light text-foreground mb-3">{product.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-lg text-foreground">{formatPrice(product.price)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
                  )}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{product.description}</p>

                {/* Colors */}
                <div className="mb-4">
                  <label className="text-xs tracking-wide uppercase text-muted-foreground mb-2 block">
                    Color {selectedColor && `— ${selectedColor}`}
                  </label>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColor === color.name ? 'border-foreground ring-2 ring-border' : 'border-border'
                        }`}
                        style={{ background: color.class.includes('bg-') ? undefined : color.class }}
                        title={color.name}
                      >
                        {color.class.includes('bg-') && <span className={`block w-full h-full rounded-full ${color.class}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <label className="text-xs tracking-wide uppercase text-muted-foreground mb-2 block">
                    Size {selectedSize && `— ${selectedSize}`}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[40px] px-2.5 py-1.5 text-[10px] tracking-wide uppercase border transition-colors ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background text-muted-foreground border-border hover:border-muted-foreground'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={!canAdd}
                  className={`w-full py-3 text-sm tracking-wide uppercase transition-colors mb-3 ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : canAdd
                      ? 'bg-primary text-primary-foreground hover:opacity-90'
                      : 'bg-secondary text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {added ? 'Added to Bag!' : canAdd ? 'Add to Bag' : 'Select Size & Color'}
                </button>

                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-center text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
