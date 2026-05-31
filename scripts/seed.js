#!/usr/bin/env node
/**
 * Supabase Seed Script - Run after creating tables via SQL Editor
 * Usage: node scripts/seed.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ecbclturuxawejoynwdx.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_ZWWfasaWDDOhK4wsT13dng_RKWqk9l9';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  { id: '1', name: 'Ivory Linen Kurta', price: 4500, original_price: 5500, category: 'men', image: '/images/product1.jpg', images: ['/images/product1.jpg', '/images/product9.jpg'], description: 'Handcrafted ivory linen kurta with subtle embroidery along the neckline. Breathable fabric perfect for Lahore summers.', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Ivory', class: 'bg-stone-100' }, { name: 'Sage', class: 'bg-emerald-100' }], badge: 'Best Seller', in_stock: true },
  { id: '2', name: 'Midnight Silk Shalwar', price: 3200, category: 'men', image: '/images/product2.jpg', images: ['/images/product2.jpg'], description: 'Premium silk shalwar in deep midnight blue. Elegant drape with comfortable elastic waistband.', sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ name: 'Midnight', class: 'bg-slate-900' }, { name: 'Charcoal', class: 'bg-gray-800' }], in_stock: true },
  { id: '3', name: 'Rose Gold Embroidered Gharara', price: 12500, original_price: 15000, category: 'women', image: '/images/product3.jpg', images: ['/images/product3.jpg', '/images/product7.jpg'], description: 'Stunning gharara set in rose gold with intricate zardozi embroidery. Perfect for weddings.', sizes: ['XS', 'S', 'M', 'L'], colors: [{ name: 'Rose Gold', class: 'bg-rose-200' }, { name: 'Emerald', class: 'bg-emerald-200' }], badge: 'New Arrival', in_stock: true },
  { id: '4', name: 'Cotton Lawn Suit — Floral Breeze', price: 3800, category: 'women', image: '/images/product4.jpg', images: ['/images/product4.jpg'], description: 'Lightweight cotton lawn 3-piece suit with delicate floral print.', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Sky', class: 'bg-sky-100' }, { name: 'Blush', class: 'bg-pink-100' }], in_stock: true },
  { id: '5', name: 'Handwoven Pashmina Shawl', price: 8900, original_price: 11000, category: 'accessories', image: '/images/product5.jpg', images: ['/images/product5.jpg'], description: 'Luxurious handwoven pashmina shawl from Kashmir. Incredibly soft and warm.', sizes: ['One Size'], colors: [{ name: 'Maroon', class: 'bg-red-900' }, { name: 'Navy', class: 'bg-blue-900' }, { name: 'Cream', class: 'bg-amber-50' }], badge: 'Limited', in_stock: true },
  { id: '6', name: 'Classic Waistcoat — Taupe', price: 5200, category: 'men', image: '/images/product6.jpg', images: ['/images/product6.jpg'], description: 'Tailored waistcoat in sophisticated taupe with wooden button closures.', sizes: ['S', 'M', 'L', 'XL'], colors: [{ name: 'Taupe', class: 'bg-stone-400' }, { name: 'Black', class: 'bg-neutral-900' }], in_stock: true },
  { id: '7', name: 'Bridal Lehenga — Crimson Dream', price: 45000, original_price: 52000, category: 'women', image: '/images/product7.jpg', images: ['/images/product7.jpg'], description: 'Exquisite bridal lehenga in deep crimson with heavy gold embroidery.', sizes: ['S', 'M', 'L'], colors: [{ name: 'Crimson', class: 'bg-red-800' }], badge: 'Bridal', in_stock: true },
  { id: '8', name: 'Leather Crossbody Bag', price: 6800, category: 'accessories', image: '/images/product8.jpg', images: ['/images/product8.jpg'], description: 'Minimalist genuine leather crossbody bag with adjustable strap.', sizes: ['One Size'], colors: [{ name: 'Tan', class: 'bg-amber-700' }, { name: 'Black', class: 'bg-neutral-900' }], in_stock: true },
  { id: '9', name: 'Chikankari Kurta — White', price: 4100, category: 'traditional', image: '/images/product9.jpg', images: ['/images/product9.jpg'], description: 'Authentic Lucknowi Chikankari hand-embroidered kurta in pristine white.', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'White', class: 'bg-white' }, { name: 'Peach', class: 'bg-orange-100' }], in_stock: true },
  { id: '10', name: 'Block Print Dupatta', price: 1800, original_price: 2200, category: 'traditional', image: '/images/product10.jpg', images: ['/images/product10.jpg'], description: 'Hand-block printed cotton dupatta with traditional motifs.', sizes: ['One Size'], colors: [{ name: 'Indigo', class: 'bg-indigo-800' }, { name: 'Mustard', class: 'bg-yellow-600' }], badge: 'Sale', in_stock: true },
  { id: '11', name: 'Linen Pants — Wide Leg', price: 2900, category: 'women', image: '/images/product11.jpg', images: ['/images/product11.jpg'], description: 'Elegant wide-leg linen pants with a high waist and clean silhouette.', sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: [{ name: 'Beige', class: 'bg-stone-200' }, { name: 'Olive', class: 'bg-lime-800' }], in_stock: true },
  { id: '12', name: 'Embroidered Mojari', price: 3500, category: 'accessories', image: '/images/product12.jpg', images: ['/images/product12.jpg'], description: 'Traditional handcrafted mojari with vibrant silk thread embroidery.', sizes: ['6', '7', '8', '9', '10', '11'], colors: [{ name: 'Multi', class: 'bg-gradient-to-r from-red-400 to-yellow-400' }, { name: 'Gold', class: 'bg-yellow-500' }], in_stock: true },
];

const orders = [
  { id: 'ORD-001', customer_name: 'Ayesha Khan', email: 'ayesha@example.com', phone: '0300-1234567', address: '42 Garden Town', city: 'Lahore', items: [{ name: 'Ivory Linen Kurta', quantity: 1, price: 4500, size: 'M', color: 'Ivory' }, { name: 'Handwoven Pashmina Shawl', quantity: 1, price: 8900, size: 'One Size', color: 'Maroon' }], total: 13400, status: 'delivered', created_at: '2024-05-20T10:30:00Z' },
  { id: 'ORD-002', customer_name: 'Bilal Ahmad', email: 'bilal@example.com', phone: '0301-9876543', address: '15 DHA Phase 5', city: 'Lahore', items: [{ name: 'Midnight Silk Shalwar', quantity: 2, price: 3200, size: 'L', color: 'Midnight' }], total: 6400, status: 'shipped', created_at: '2024-05-22T14:15:00Z' },
  { id: 'ORD-003', customer_name: 'Fatima Zahra', email: 'fatima@example.com', phone: '0302-4567890', address: '78 Gulberg III', city: 'Lahore', items: [{ name: 'Rose Gold Embroidered Gharara', quantity: 1, price: 12500, size: 'M', color: 'Rose Gold' }], total: 12500, status: 'processing', created_at: '2024-05-25T09:00:00Z' },
  { id: 'ORD-004', customer_name: 'Hassan Ali', email: 'hassan@example.com', phone: '0303-1122334', address: '21 Model Town', city: 'Lahore', items: [{ name: 'Classic Waistcoat — Taupe', quantity: 1, price: 5200, size: 'XL', color: 'Taupe' }, { name: 'Leather Crossbody Bag', quantity: 1, price: 6800, size: 'One Size', color: 'Tan' }], total: 12000, status: 'pending', created_at: '2024-05-28T16:45:00Z' },
  { id: 'ORD-005', customer_name: 'Sana Malik', email: 'sana@example.com', phone: '0304-5566778', address: '9 Johar Town', city: 'Lahore', items: [{ name: 'Bridal Lehenga — Crimson Dream', quantity: 1, price: 45000, size: 'S', color: 'Crimson' }], total: 45000, status: 'pending', created_at: '2024-05-29T11:20:00Z' },
];

async function seed() {
  console.log('🔗 Connecting to Supabase...');
  console.log(`   URL: ${SUPABASE_URL}`);

  const { error: tableError } = await supabase.from('products').select('id').limit(1);

  if (tableError && tableError.code === 'PGRST205') {
    console.error('\n❌ ERROR: The "products" table does not exist.');
    console.error('\n👉 Please run the SQL in supabase-seed.sql first:');
    console.error('   1. Open https://supabase.com/dashboard/project/ecbclturuxawejoynwdx');
    console.error('   2. Go to SQL Editor → New query');
    console.error('   3. Open supabase-seed.sql and paste all contents');
    console.error('   4. Click "Run"');
    console.error('\n   Then run: node scripts/seed.js\n');
    process.exit(1);
  }

  if (tableError) {
    console.error('\n❌ Connection error:', tableError.message);
    process.exit(1);
  }

  console.log('✅ Connected!\n');

  console.log('📝 Inserting 12 products...');
  const { error: pErr } = await supabase.from('products').upsert(products, { onConflict: 'id' });
  if (pErr) console.error('❌ Products error:', pErr.message);
  else console.log('✅ Products done!\n');

  console.log('📝 Inserting 5 demo orders...');
  const { error: oErr } = await supabase.from('orders').upsert(orders, { onConflict: 'id' });
  if (oErr) console.error('❌ Orders error:', oErr.message);
  else console.log('✅ Orders done!\n');

  const { data: pc } = await supabase.from('products').select('count');
  const { data: oc } = await supabase.from('orders').select('count');
  console.log('📊 Final: ' + (pc?.[0]?.count || 0) + ' products, ' + (oc?.[0]?.count || 0) + ' orders');
  console.log('\n🎉 Your Apna store database is ready!\n');
}

seed().catch(console.error);
