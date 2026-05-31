'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20 }}
      className="text-center max-w-md"
    >
      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>

      <h1 className="text-3xl font-light text-foreground mb-3">Thank You!</h1>
      <p className="text-muted-foreground text-sm mb-2">Your order has been placed successfully.</p>
      {orderId && (
        <p className="text-muted-foreground text-sm font-mono mb-8">
          Order ID: <span className="font-medium">{orderId}</span>
        </p>
      )}

      <div className="bg-secondary border border-border rounded-sm p-5 mb-8 text-left">
        <h2 className="text-xs tracking-wide uppercase text-muted-foreground mb-3">What happens next?</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
            We will confirm your order via WhatsApp/SMS within 30 minutes.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
            Your order will be packed and shipped within 1-2 business days.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
            Pay cash on delivery when your package arrives.
          </li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/shop"
          className="px-8 py-3 bg-primary text-primary-foreground text-sm tracking-wide uppercase text-center hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
        <Link
          href="/"
          className="px-8 py-3 border border-border text-foreground text-sm tracking-wide uppercase text-center hover:bg-secondary transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </motion.div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="text-center">
          <div className="w-16 h-16 bg-secondary animate-pulse rounded-full mx-auto mb-6" />
          <div className="h-8 w-48 bg-secondary animate-pulse rounded mb-3 mx-auto" />
          <div className="h-4 w-64 bg-secondary animate-pulse rounded mx-auto" />
        </div>
      }>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
