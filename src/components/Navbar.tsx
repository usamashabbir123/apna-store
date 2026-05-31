'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import SearchModal from './SearchModal';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { totalItems, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-light tracking-[0.2em] text-foreground uppercase">
                Apna
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                Home
              </Link>
              <Link href="/shop" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                Shop
              </Link>
              <Link href="/shop?category=men" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                Men
              </Link>
              <Link href="/shop?category=women" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                Women
              </Link>
              <Link href="/shop?category=traditional" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase">
                Traditional
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <SearchModal />

              <ThemeToggle />

              <div className="w-px h-4 bg-border hidden sm:block" />

              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors uppercase"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                Admin
              </Link>

              <div className="w-px h-4 bg-border hidden sm:block" />

              <button
                onClick={openCart}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Open cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <path d="M3 6h18" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-medium w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-muted-foreground"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 py-4 space-y-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Home</Link>
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Shop</Link>
              <Link href="/shop?category=men" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Men</Link>
              <Link href="/shop?category=women" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Women</Link>
              <Link href="/shop?category=traditional" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Traditional</Link>
              <Link href="/shop?category=accessories" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Accessories</Link>
              <Link href="/admin" onClick={() => setMobileOpen(false)} className="block text-sm tracking-wide text-foreground uppercase py-2">Admin</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
