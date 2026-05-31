# Apna — Modern Fashion Store

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Apna** — A curated fashion e-commerce experience blending modern elegance with timeless tradition. Built for Lahore and beyond.

[Live Demo](https://apna-store.vercel.app) · [Report Bug](https://github.com/usamashabbir123/apna-store/issues) · [Request Feature](https://github.com/usamashabbir123/apna-store/issues)

---

## ✨ Features

### 🛍️ Storefront
- **Dark / Light Mode** — Toggle with sun/moon icon in navbar
- **Command+K Search** — Instant product search with keyboard shortcut
- **Category Filtering** — Men, Women, Traditional, Accessories
- **Quick View Modal** — Preview products without leaving the grid
- **Wishlist** — Save favorites with localStorage persistence
- **Cart Drawer** — Slide-in cart with quantity controls and animations
- **Responsive Grid** — 2-column on mobile, 4-column on desktop
- **Framer Motion Animations** — Smooth page transitions and hover effects

### 🛒 Checkout
- **Cash on Delivery (COD)** — Full customer form with PKR currency
- **Order Confirmation** — Animated thank-you page with next steps
- **Cart Persistence** — localStorage survives refresh

### 🎛️ Admin Dashboard
- **Secure Login** — Password-protected admin access
- **Product CMS** — Create, edit, delete products with image uploads
- **Order Management** — View all orders, update status
- **Theme Customizer** — Colors, fonts, button styles
- **Homepage Builder** — Drag/reorder sections
- **Footer Builder** — Customize footer columns

### 🗄️ Backend
- **Supabase Integration** — PostgreSQL database with real-time subscriptions
- **Row Level Security (RLS)** — Secure data access
- **Image Storage** — Supabase Storage bucket for product images
- **Graceful Fallback** — Works with local mock data if DB unavailable

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [Supabase](https://supabase.com/) (PostgreSQL) |
| Auth | Custom admin auth (service role bypass) |
| Storage | Supabase Storage |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Icons | Lucide / Custom SVG |
| Fonts | [Geist](https://vercel.com/font) (Vercel) |

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- npm or pnpm
- Supabase project (free tier works)

### 1. Clone the repo
```bash
git clone https://github.com/usamashabbir123/apna-store.git
cd apna-store
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Set up Supabase Database
Run the SQL files in Supabase SQL Editor:
- `supabase-seed.sql` — Create products and orders tables + seed data
- `supabase-cms-schema.sql` — Create settings, homepage_sections, footer_columns tables

### 5. Create Storage Bucket
In Supabase Dashboard → Storage:
- Create bucket named `products`
- Set to **Public**

### 6. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 7. Access Admin Panel
- Go to [http://localhost:3000/admin](http://localhost:3000/admin)
- Password: `apna2024`

---

## 🗂️ Project Structure

```
apna-store/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard pages
│   │   ├── checkout/     # Checkout page
│   │   ├── order-confirmation/
│   │   ├── product/[id]/ # Product detail (Server Component)
│   │   ├── shop/         # Shop with category filters
│   │   ├── layout.tsx    # Root layout with ThemeProvider
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   │   ├── sections/     # Homepage section renderers
│   │   └── admin/        # Admin-specific components
│   ├── context/          # React Context (Cart, Wishlist, Auth)
│   ├── lib/
│   │   ├── actions/      # Server Actions (products, orders, settings)
│   │   ├── supabase*.ts  # Supabase clients (public, admin, server)
│   │   └── types.ts      # TypeScript types
│   └── data/             # Local mock data (fallback)
├── public/images/        # Product & category images
├── supabase-*.sql        # Database schema files
└── .env.local            # Environment variables
```

---

## 🧪 Database Schema

### `products` Table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| name | text | Product name |
| description | text | Product description |
| price | integer | Price in PKR |
| original_price | integer | Sale price (optional) |
| category | text | men / women / traditional / accessories |
| image | text | Main image URL |
| images | text[] | Gallery images |
| colors | jsonb | Color options |
| sizes | text[] | Size options |
| badge | text | New / Featured / Bestseller |
| in_stock | boolean | Availability |
| created_at | timestamptz | Auto |

### `orders` Table
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | Primary key |
| customer_name | text | Customer name |
| email | text | Customer email |
| phone | text | Phone number |
| address | text | Shipping address |
| city | text | City |
| items | jsonb | Order items array |
| total | integer | Total amount (PKR) |
| status | text | pending / confirmed / shipped / delivered / cancelled |
| created_at | timestamptz | Auto |

---

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo on [Vercel](https://vercel.com)
3. Add environment variables in Vercel Dashboard
4. Deploy!

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the incredible framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Supabase](https://supabase.com/) for the open-source Firebase alternative
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations
- [Geist Font](https://vercel.com/font) by Vercel

---

> Built with ❤️ in Lahore, Pakistan
