import { Suspense } from 'react';
import HeroSection from './HeroSection';
import CategoryGridSection from './CategoryGridSection';
import ProductGridSection from './ProductGridSection';
import PromoSection from './PromoSection';
import ValuesSection from './ValuesSection';

interface SectionRendererProps {
  type: string;
  config: any;
}

export default function SectionRenderer({ type, config }: SectionRendererProps) {
  switch (type) {
    case 'hero':
      return <HeroSection config={config} />;
    case 'category_grid':
      return <CategoryGridSection config={config} />;
    case 'product_grid':
      return (
        <Suspense fallback={
          <div className="py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-8 w-48 bg-secondary animate-pulse rounded mb-8 mx-auto" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        }>
          <ProductGridSection config={config} />
        </Suspense>
      );
    case 'promo':
      return <PromoSection config={config} />;
    case 'values':
      return <ValuesSection config={config} />;
    case 'testimonials':
      return (
        <section className="py-16 lg:py-24 bg-muted">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-light text-foreground mb-8">{config.title || 'What Our Customers Say'}</h2>
            <p className="text-muted-foreground text-sm">Testimonials section — customize from the admin panel.</p>
          </div>
        </section>
      );
    case 'newsletter':
      return (
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-light mb-4">{config.title || 'Join the Apna Family'}</h2>
            <p className="text-primary-foreground/60 text-sm mb-6">{config.subtitle || 'Subscribe for exclusive offers and new arrivals.'}</p>
            <div className="flex max-w-md mx-auto gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-primary-foreground/10 border border-primary-foreground/20 text-sm text-primary-foreground placeholder-primary-foreground/40 focus:outline-none" />
              <button className="px-6 py-2.5 bg-primary-foreground text-primary text-sm tracking-wide uppercase hover:bg-primary-foreground/90 transition-colors">Subscribe</button>
            </div>
          </div>
        </section>
      );
    case 'text_block':
      return (
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-light text-foreground mb-4">{config.title || ''}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{config.content || ''}</p>
          </div>
        </section>
      );
    default:
      return null;
  }
}
