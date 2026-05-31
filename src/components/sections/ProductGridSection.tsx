import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/actions/products';

interface ProductGridSectionProps {
  config: {
    title?: string;
    subtitle?: string;
    filter?: string;
  };
}

export default async function ProductGridSection({ config }: ProductGridSectionProps) {
  const allProducts = await getProducts();

  // Simple filter logic — in real app could be more sophisticated
  let products = allProducts;
  if (config.filter === 'featured') {
    products = allProducts.filter((p) => p.badge);
  } else if (config.filter === 'trending') {
    products = allProducts.slice(4, 8);
  }

  // Limit to 4
  products = products.slice(0, 4);

  return (
    <ProductGrid
      products={products}
      title={config.title}
      subtitle={config.subtitle}
    />
  );
}
