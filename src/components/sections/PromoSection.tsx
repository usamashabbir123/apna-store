import Image from 'next/image';
import Link from 'next/link';

interface PromoSectionProps {
  config: {
    title?: string;
    subtitle?: string;
    cta?: { text: string; link: string };
    bgImage?: string;
  };
}

export default function PromoSection({ config }: PromoSectionProps) {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden bg-secondary">
      <div className="absolute inset-0">
        <Image
          src={config.bgImage || '/images/promo.jpg'}
          alt="Promo"
          fill
          className="object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Heritage Collection</p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">
          {config.title || 'Celebrate Our Roots'}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
          {config.subtitle || 'Discover traditional craftsmanship reimagined for the modern wardrobe.'}
        </p>
        {config.cta && (
          <Link
            href={config.cta.link || '/shop?category=traditional'}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity"
          >
            {config.cta.text || 'Explore Traditional'}
          </Link>
        )}
      </div>
    </section>
  );
}
