'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-muted">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Apna Fashion"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-xl">
          <p className="text-white/80 text-sm tracking-[0.3em] uppercase mb-4">
            Lahore&apos;s Finest
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6">
            Style That
            <br />
            <span className="font-normal italic">Speaks</span> You
          </h1>
          <p className="text-white/70 text-base sm:text-lg mb-10 max-w-md leading-relaxed">
            Discover curated fashion that blends modern elegance with timeless tradition. Crafted for the discerning individual.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-foreground text-sm tracking-wide uppercase hover:bg-muted transition-colors"
            >
              Shop Collection
            </Link>
            <Link
              href="/shop?category=traditional"
              className="inline-flex items-center justify-center px-8 py-3.5 border border-white/40 text-white text-sm tracking-wide uppercase hover:bg-white/10 transition-colors"
            >
              Traditional Wear
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-white/30" />
      </div>
    </section>
  );
}
