-- ============================================
-- APNA STORE - Supabase Database Setup
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ============================================

-- 1. Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  category TEXT NOT NULL CHECK (category IN ('men', 'women', 'traditional', 'accessories')),
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  description TEXT NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  colors JSONB DEFAULT '[]',
  badge TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT 'ORD-' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0'),
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies (if re-running)
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow admin updates" ON products;
DROP POLICY IF EXISTS "Allow admin access" ON orders;

-- 5. Create policies
CREATE POLICY "Allow public read access" ON products
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow admin updates" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin access" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. Clear existing data (if re-seeding)
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE orders CASCADE;

-- 7. Insert products
INSERT INTO products (id, name, price, original_price, category, image, images, description, sizes, colors, badge, in_stock) VALUES
('1', 'Ivory Linen Kurta', 4500, 5500, 'men', '/images/product1.jpg', ARRAY['/images/product1.jpg', '/images/product9.jpg'], 'Handcrafted ivory linen kurta with subtle embroidery along the neckline. Breathable fabric perfect for Lahore summers. Features a relaxed fit with side slits and a mandarin collar.', ARRAY['S', 'M', 'L', 'XL'], '[{"name":"Ivory","class":"bg-stone-100"},{"name":"Sage","class":"bg-emerald-100"}]', 'Best Seller', true),
('2', 'Midnight Silk Shalwar', 3200, NULL, 'men', '/images/product2.jpg', ARRAY['/images/product2.jpg'], 'Premium silk shalwar in deep midnight blue. Elegant drape with comfortable elastic waistband. Ideal for formal occasions and evening wear.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], '[{"name":"Midnight","class":"bg-slate-900"},{"name":"Charcoal","class":"bg-gray-800"}]', NULL, true),
('3', 'Rose Gold Embroidered Gharara', 12500, 15000, 'women', '/images/product3.jpg', ARRAY['/images/product3.jpg', '/images/product7.jpg'], 'Stunning gharara set in rose gold with intricate zardozi embroidery. Perfect for weddings and festive celebrations. Includes matching dupatta.', ARRAY['XS', 'S', 'M', 'L'], '[{"name":"Rose Gold","class":"bg-rose-200"},{"name":"Emerald","class":"bg-emerald-200"}]', 'New Arrival', true),
('4', 'Cotton Lawn Suit — Floral Breeze', 3800, NULL, 'women', '/images/product4.jpg', ARRAY['/images/product4.jpg'], 'Lightweight cotton lawn 3-piece suit with delicate floral print. Designed for comfort during hot summer days. Includes shirt, trousers, and dupatta.', ARRAY['S', 'M', 'L', 'XL'], '[{"name":"Sky","class":"bg-sky-100"},{"name":"Blush","class":"bg-pink-100"}]', NULL, true),
('5', 'Handwoven Pashmina Shawl', 8900, 11000, 'accessories', '/images/product5.jpg', ARRAY['/images/product5.jpg'], 'Luxurious handwoven pashmina shawl from the valleys of Kashmir. Incredibly soft, warm, and lightweight. Features traditional paisley patterns.', ARRAY['One Size'], '[{"name":"Maroon","class":"bg-red-900"},{"name":"Navy","class":"bg-blue-900"},{"name":"Cream","class":"bg-amber-50"}]', 'Limited', true),
('6', 'Classic Waistcoat — Taupe', 5200, NULL, 'men', '/images/product6.jpg', ARRAY['/images/product6.jpg'], 'Tailored waistcoat in sophisticated taupe. Features wooden button closures and a slim modern cut. Pairs beautifully with kurtas or shirts.', ARRAY['S', 'M', 'L', 'XL'], '[{"name":"Taupe","class":"bg-stone-400"},{"name":"Black","class":"bg-neutral-900"}]', NULL, true),
('7', 'Bridal Lehenga — Crimson Dream', 45000, 52000, 'women', '/images/product7.jpg', ARRAY['/images/product7.jpg'], 'Exquisite bridal lehenga in deep crimson with heavy gold embroidery. A statement piece for your special day. Includes lehenga, choli, and dupatta.', ARRAY['S', 'M', 'L'], '[{"name":"Crimson","class":"bg-red-800"}]', 'Bridal', true),
('8', 'Leather Crossbody Bag', 6800, NULL, 'accessories', '/images/product8.jpg', ARRAY['/images/product8.jpg'], 'Minimalist genuine leather crossbody bag with adjustable strap. Clean lines, practical compartments, and timeless design.', ARRAY['One Size'], '[{"name":"Tan","class":"bg-amber-700"},{"name":"Black","class":"bg-neutral-900"}]', NULL, true),
('9', 'Chikankari Kurta — White', 4100, NULL, 'traditional', '/images/product9.jpg', ARRAY['/images/product9.jpg'], 'Authentic Lucknowi Chikankari hand-embroidered kurta in pristine white. Delicate shadow work embroidery on breathable cotton.', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name":"White","class":"bg-white"},{"name":"Peach","class":"bg-orange-100"}]', NULL, true),
('10', 'Block Print Dupatta', 1800, 2200, 'traditional', '/images/product10.jpg', ARRAY['/images/product10.jpg'], 'Hand-block printed cotton dupatta with traditional motifs. Lightweight and versatile — pairs with any solid kurta.', ARRAY['One Size'], '[{"name":"Indigo","class":"bg-indigo-800"},{"name":"Mustard","class":"bg-yellow-600"}]', 'Sale', true),
('11', 'Linen Pants — Wide Leg', 2900, NULL, 'women', '/images/product11.jpg', ARRAY['/images/product11.jpg'], 'Elegant wide-leg linen pants with a high waist and clean silhouette. Perfect for both casual and formal wear.', ARRAY['XS', 'S', 'M', 'L', 'XL'], '[{"name":"Beige","class":"bg-stone-200"},{"name":"Olive","class":"bg-lime-800"}]', NULL, true),
('12', 'Embroidered Mojari', 3500, NULL, 'accessories', '/images/product12.jpg', ARRAY['/images/product12.jpg'], 'Traditional handcrafted mojari with vibrant silk thread embroidery. Soft leather sole and comfortable fit for all-day wear.', ARRAY['6', '7', '8', '9', '10', '11'], '[{"name":"Multi","class":"bg-gradient-to-r from-red-400 to-yellow-400"},{"name":"Gold","class":"bg-yellow-500"}]', NULL, true);

-- 8. Insert demo orders
INSERT INTO orders (id, customer_name, email, phone, address, city, items, total, status, created_at) VALUES
('ORD-001', 'Ayesha Khan', 'ayesha@example.com', '0300-1234567', '42 Garden Town', 'Lahore', '[{"name":"Ivory Linen Kurta","quantity":1,"price":4500,"size":"M","color":"Ivory"},{"name":"Handwoven Pashmina Shawl","quantity":1,"price":8900,"size":"One Size","color":"Maroon"}]', 13400, 'delivered', '2024-05-20T10:30:00Z'),
('ORD-002', 'Bilal Ahmad', 'bilal@example.com', '0301-9876543', '15 DHA Phase 5', 'Lahore', '[{"name":"Midnight Silk Shalwar","quantity":2,"price":3200,"size":"L","color":"Midnight"}]', 6400, 'shipped', '2024-05-22T14:15:00Z'),
('ORD-003', 'Fatima Zahra', 'fatima@example.com', '0302-4567890', '78 Gulberg III', 'Lahore', '[{"name":"Rose Gold Embroidered Gharara","quantity":1,"price":12500,"size":"M","color":"Rose Gold"}]', 12500, 'processing', '2024-05-25T09:00:00Z'),
('ORD-004', 'Hassan Ali', 'hassan@example.com', '0303-1122334', '21 Model Town', 'Lahore', '[{"name":"Classic Waistcoat — Taupe","quantity":1,"price":5200,"size":"XL","color":"Taupe"},{"name":"Leather Crossbody Bag","quantity":1,"price":6800,"size":"One Size","color":"Tan"}]', 12000, 'pending', '2024-05-28T16:45:00Z'),
('ORD-005', 'Sana Malik', 'sana@example.com', '0304-5566778', '9 Johar Town', 'Lahore', '[{"name":"Bridal Lehenga — Crimson Dream","quantity":1,"price":45000,"size":"S","color":"Crimson"}]', 45000, 'pending', '2024-05-29T11:20:00Z');
