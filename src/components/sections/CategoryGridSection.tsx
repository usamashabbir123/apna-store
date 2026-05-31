import Image from 'next/image';
import Link from 'next/link';

interface CategoryGridSectionProps {
  config: {
    title?: string;
    subtitle?: string;
  };
}

const categories = [
  { name: 'Men', image: '/images/men.jpg', href: '/shop?category=men' },
  { name: 'Women', image: '/images/women.jpg', href: '/shop?category=women' },
  { name: 'Traditional', image: '/images/traditional.jpg', href: '/shop?category=traditional' },
  { name: 'Accessories', image: '/images/accessories.jpg', href: '/shop?category=accessories' },
];

export default function CategoryGridSection({ config }: CategoryGridSectionProps) {
  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-3">
            {config.title || 'Shop by Category'}
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{config.subtitle || 'Explore our collections'}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={cat.href} className="group relative aspect-[3/4] overflow-hidden bg-secondary">
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg tracking-[0.2em] uppercase font-light">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
