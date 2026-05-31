import Link from 'next/link';
import { getProductById } from '@/lib/actions/products';
import ProductDetailClient from '@/components/ProductDetailClient';

export async function generateStaticParams() {
  // We'll generate at build time for the initial products
  return Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-light text-foreground mb-4">Product Not Found</h1>
        <p className="text-sm text-muted-foreground mb-6">
          The product you are looking for does not exist.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-2.5 bg-primary text-primary-foreground text-sm tracking-wide uppercase hover:opacity-90 transition-opacity"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
