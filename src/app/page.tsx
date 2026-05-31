import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import Image from "next/image";
import Link from "next/link";
import { getHomepageSections } from "@/lib/actions/settings";
import { getProducts } from "@/lib/actions/products";
import SectionRenderer from "@/components/sections/SectionRenderer";

// Fallback static sections when DB is empty
function StaticHome({ products }: { products: any[] }) {
  const featured = products.slice(0, 4);
  const trending = products.slice(4, 8);

  return (
    <>
      <Hero />

      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl font-light text-foreground mb-3">Shop by Category</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Explore our collections designed for every occasion</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Men', image: '/images/men.jpg', href: '/shop?category=men' },
              { name: 'Women', image: '/images/women.jpg', href: '/shop?category=women' },
              { name: 'Traditional', image: '/images/traditional.jpg', href: '/shop?category=traditional' },
              { name: 'Accessories', image: '/images/accessories.jpg', href: '/shop?category=accessories' },
            ].map((cat) => (
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

      <ProductGrid products={featured} title="Featured Collection" subtitle="Handpicked pieces that define this season's must-haves" />

      <section className="relative py-20 lg:py-28 overflow-hidden bg-secondary">
        <div className="absolute inset-0">
          <Image src="/images/promo.jpg" alt="Traditional Collection" fill className="object-cover opacity-40" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Heritage Collection</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light text-foreground mb-6">Celebrate Our Roots</h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Discover traditional craftsmanship reimagined for the modern wardrobe.
          </p>
          <Link href="/shop?category=traditional" className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity">
            Explore Traditional
          </Link>
        </div>
      </section>

      <ProductGrid products={trending} title="Trending Now" subtitle="What our customers are loving this week" />

      <section className="py-16 lg:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { title: 'Curated Quality', text: 'Every piece is hand-selected for exceptional craftsmanship and fabric quality.' },
              { title: 'Local Craftsmanship', text: 'Supporting artisans across Pakistan with fair trade practices.' },
              { title: 'Lahore Based', text: 'Proudly serving our community with fast local delivery and easy returns.' },
            ].map((v) => (
              <div key={v.title}>
                <h3 className="text-sm font-medium text-foreground mb-2">{v.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default async function Home() {
  const [sections, products] = await Promise.all([getHomepageSections(), getProducts()]);
  const activeSections = sections.filter((s) => s.is_active).sort((a, b) => a.order - b.order);

  // If no sections in DB yet, show static fallback
  if (activeSections.length === 0) {
    return <StaticHome products={products.length > 0 ? products : []} />;
  }

  return (
    <>
      {activeSections.map((section) => (
        <SectionRenderer key={section.id} type={section.type} config={section.config || {}} />
      ))}
    </>
  );
}
