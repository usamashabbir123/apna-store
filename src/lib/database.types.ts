export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          original_price: number | null;
          category: 'men' | 'women' | 'traditional' | 'accessories';
          image: string;
          images: string[];
          description: string;
          sizes: string[];
          colors: Json[];
          badge: string | null;
          in_stock: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          original_price?: number | null;
          category: 'men' | 'women' | 'traditional' | 'accessories';
          image: string;
          images?: string[];
          description: string;
          sizes?: string[];
          colors?: Json[];
          badge?: string | null;
          in_stock?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          original_price?: number | null;
          category?: 'men' | 'women' | 'traditional' | 'accessories';
          image?: string;
          images?: string[];
          description?: string;
          sizes?: string[];
          colors?: Json[];
          badge?: string | null;
          in_stock?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          customer_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          items: Json[];
          total: number;
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          items: Json[];
          total: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          address?: string;
          city?: string;
          items?: Json[];
          total?: number;
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
          created_at?: string;
        };
      };
    };
  };
}
