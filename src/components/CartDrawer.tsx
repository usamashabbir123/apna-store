'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-background z-[70] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-sm tracking-[0.2em] uppercase font-medium text-foreground">
            Your Bag ({totalItems})
          </h2>
          <button
            onClick={closeCart}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/30 mb-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-muted-foreground text-sm mb-1">Your bag is empty</p>
              <p className="text-muted-foreground/70 text-xs mb-6">Add some beautiful pieces to get started</p>
              <button
                onClick={closeCart}
                className="text-sm tracking-wide uppercase underline underline-offset-4 text-foreground hover:text-muted-foreground"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div
                    key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex gap-4"
                  >
                    <div className="relative w-20 h-24 flex-shrink-0 bg-secondary overflow-hidden">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.color} / {item.size}
                      </p>
                      <p className="text-sm text-foreground mt-1">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-secondary text-xs"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-xs text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:bg-secondary text-xs"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          className="text-xs text-muted-foreground hover:text-red-500 underline underline-offset-2 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-medium text-foreground">{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-muted-foreground/70">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-3.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase text-center hover:opacity-90 transition-opacity"
            >
              Checkout
            </Link>
            <button
              onClick={closeCart}
              className="w-full text-center text-xs tracking-wide uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
