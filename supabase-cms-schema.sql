-- ============================================
-- APNA STORE CMS - Phase 2 Schema
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

-- Settings table (key-value store for theme, footer, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT 'setting-' || gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage sections (drag-and-drop page builder)
CREATE TABLE IF NOT EXISTS homepage_sections (
  id TEXT PRIMARY KEY DEFAULT 'sec-' || gen_random_uuid(),
  page TEXT NOT NULL DEFAULT 'home',
  type TEXT NOT NULL CHECK (type IN ('hero', 'category_grid', 'product_grid', 'promo', 'values', 'testimonials', 'newsletter', 'text_block')),
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Footer columns
CREATE TABLE IF NOT EXISTS footer_columns (
  id TEXT PRIMARY KEY DEFAULT 'col-' || gen_random_uuid(),
  "order" INTEGER NOT NULL DEFAULT 0,
  title TEXT,
  items JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_columns ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Allow public read access settings" ON settings;
DROP POLICY IF EXISTS "Allow admin settings" ON settings;
DROP POLICY IF EXISTS "Allow public read homepage" ON homepage_sections;
DROP POLICY IF EXISTS "Allow admin homepage" ON homepage_sections;
DROP POLICY IF EXISTS "Allow public read footer" ON footer_columns;
DROP POLICY IF EXISTS "Allow admin footer" ON footer_columns;

-- Public read policies
CREATE POLICY "Allow public read access settings" ON settings
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read homepage" ON homepage_sections
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Allow public read footer" ON footer_columns
  FOR SELECT TO anon, authenticated USING (true);

-- Admin write policies (service role bypasses anyway, but good practice)
CREATE POLICY "Allow admin settings" ON settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin homepage" ON homepage_sections
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin footer" ON footer_columns
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed default settings
INSERT INTO settings (key, value) VALUES
('theme', '{"primaryColor":"#292524","bgColor":"#ffffff","textColor":"#1c1917","fontFamily":"Geist, sans-serif","buttonRadius":"0","buttonStyle":"square","navbarSticky":true}'),
('footer', '{"copyright":"© 2024 Apna. All rights reserved.","bgColor":"#1c1917"}')
ON CONFLICT (key) DO NOTHING;

-- Seed default homepage sections
INSERT INTO homepage_sections (id, page, type, "order", is_active, config) VALUES
('sec-hero', 'home', 'hero', 1, true, '{"headline":"Style That Speaks You","subheadline":"Discover curated fashion that blends modern elegance with timeless tradition.","ctaPrimary":{"text":"Shop Collection","link":"/shop"},"ctaSecondary":{"text":"Traditional Wear","link":"/shop?category=traditional"},"bgImage":"/images/hero.jpg"}'),
('sec-cats', 'home', 'category_grid', 2, true, '{"title":"Shop by Category","subtitle":"Explore our collections designed for every occasion"}'),
('sec-featured', 'home', 'product_grid', 3, true, '{"title":"Featured Collection","subtitle":"Handpicked pieces that define this season''s must-haves","filter":"featured"}'),
('sec-promo', 'home', 'promo', 4, true, '{"title":"Celebrate Our Roots","subtitle":"Discover traditional craftsmanship reimagined for the modern wardrobe.","cta":{"text":"Explore Traditional","link":"/shop?category=traditional"},"bgImage":"/images/promo.jpg"}'),
('sec-trending', 'home', 'product_grid', 5, true, '{"title":"Trending Now","subtitle":"What our customers are loving this week","filter":"trending"}'),
('sec-values', 'home', 'values', 6, true, '{}')
ON CONFLICT (id) DO NOTHING;

-- Seed default footer columns
INSERT INTO footer_columns (id, "order", title, items) VALUES
('col-brand', 0, null, '[{"type":"text","content":"Apna"}, {"type":"text","content":"Modern fashion rooted in tradition. Curated for the discerning individual in Lahore and beyond."}]'),
('col-shop', 1, 'Shop', '[{"type":"link","label":"Men","href":"/shop?category=men"}, {"type":"link","label":"Women","href":"/shop?category=women"}, {"type":"link","label":"Traditional","href":"/shop?category=traditional"}, {"type":"link","label":"Accessories","href":"/shop?category=accessories"}]'),
('col-support', 2, 'Support', '[{"type":"text","label":"Shipping Info"}, {"type":"text","label":"Returns & Exchanges"}, {"type":"text","label":"Size Guide"}, {"type":"text","label":"Contact Us"}]'),
('col-contact', 3, 'Visit Us', '[{"type":"text","content":"Apna Flagship Store"}, {"type":"text","content":"MM Alam Road, Gulberg III"}, {"type":"text","content":"Lahore, Pakistan"}, {"type":"text","content":"hello@apna.pk"}]')
ON CONFLICT (id) DO NOTHING;
