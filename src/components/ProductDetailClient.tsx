'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const canAdd = selectedSize && selectedColor;

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-foreground capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] bg-secondary overflow-hidden">
              <Image
                src={product.images[selectedImage] || product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-background/90 backdrop-blur-sm text-[10px] tracking-widest uppercase text-foreground">
                  {product.badge}
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 bg-secondary overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? 'border-foreground' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="lg:py-6">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-xl text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Colors */}
            <div className="mb-6">
              <label className="text-xs tracking-wide uppercase text-muted-foreground mb-2 block">
                Color {selectedColor && `— ${selectedColor}`}
              </label>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-foreground ring-2 ring-border'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    style={{ background: color.class.includes('bg-') ? undefined : color.class }}
                    title={color.name}
                  >
                    {color.class.includes('bg-') && (
                      <span className={`block w-full h-full rounded-full ${color.class}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="mb-8">
              <label className="text-xs tracking-wide uppercase text-muted-foreground mb-2 block">
                Size {selectedSize && `— ${selectedSize}`}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] px-3 py-2 text-xs tracking-wide uppercase border transition-colors ${
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

            {/* Add to Cart */}
            <div className="space-y-3">
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                className={`w-full py-4 text-sm tracking-wide uppercase transition-colors ${
                  added
                    ? 'bg-emerald-700 text-white'
                    : canAdd
                    ? 'bg-primary text-primary-foreground hover:opacity-90'
                    : 'bg-secondary text-muted-foreground cursor-not-allowed'
                }`}
              >
                {added ? 'Added to Bag!' : canAdd ? 'Add to Bag' : 'Select Size & Color'}
              </button>
              {!canAdd && (
                <p className="text-xs text-muted-foreground text-center">
                  Please select a size and color to continue
                </p>
              )}
            </div>

            {/* Details */}
            <div className="mt-10 pt-8 border-t border-border space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span className="text-foreground font-mono text-xs">APN-{product.id.padStart(4, '0')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Category</span>
                <span className="text-foreground capitalize">{product.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className={product.inStock ? 'text-emerald-600' : 'text-red-500'}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-border">
          <ProductGrid
            products={related}
            title="You May Also Like"
            subtitle="Complete your look with these curated pieces"
          />
        </div>
      )}
    </>
  );
}
