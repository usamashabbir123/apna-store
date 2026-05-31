export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'traditional' | 'accessories';
  image: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: { name: string; class: string }[];
  badge?: string;
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}
