'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { createOrder } from '@/lib/actions/orders';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: 'Lahore',
    notes: '',
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = totalPrice;
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);
    const orderId = await createOrder({
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      items: items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        size: i.size,
        color: i.color,
      })),
      total,
      status: 'pending',
    });

    setSubmitting(false);
    if (orderId) {
      clearCart();
      router.push(`/order-confirmation?order=${orderId}`);
    } else {
      alert('Failed to place order. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-light text-foreground mb-4">Your Bag is Empty</h1>
        <p className="text-sm text-muted-foreground mb-8">Add some beautiful pieces before checking out.</p>
        <Link href="/shop" className="inline-block px-8 py-3 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="text-2xl sm:text-3xl font-light text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Customer Form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-foreground mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="Ayesha Khan"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">Email *</label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="ayesha@example.com"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">Phone *</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full sm:w-1/2 px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                  placeholder="0300-1234567"
                />
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">Address *</label>
                  <input
                    required
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                    placeholder="42 Garden Town"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">City *</label>
                  <select
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full sm:w-1/2 px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-wide uppercase text-muted-foreground mb-1.5">Order Notes (Optional)</label>
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="w-full px-4 py-2.5 border border-border text-sm bg-background text-foreground focus:outline-none focus:border-muted-foreground transition-colors resize-none"
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-medium text-foreground mb-4">Payment Method</h2>
              <div className="border border-border p-4 bg-secondary">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border-2 border-foreground flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-10 py-3.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Placing Order...' : `Place Order · ${formatPrice(total)}`}
            </button>

            <Link href="/shop" className="block text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 mt-2">
              Continue Shopping
            </Link>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-secondary border border-border p-6 sticky top-24">
            <h2 className="text-sm font-medium text-foreground mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.product.id}-${item.size}-${item.color}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3"
                >
                  <div className="relative w-14 h-16 bg-muted flex-shrink-0 overflow-hidden">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{item.product.name}</p>
                    <p className="text-[10px] text-muted-foreground">{item.color} / {item.size}</p>
                    <p className="text-xs text-foreground mt-0.5">
                      {item.quantity} × {formatPrice(item.product.price)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-muted-foreground/70">
                  Free shipping on orders over PKR 5,000
                </p>
              )}
              <div className="flex justify-between text-base font-medium text-foreground pt-2 border-t border-border">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
