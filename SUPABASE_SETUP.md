# Supabase Setup Guide for Apna

## Step 1: Get Your Credentials

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Project Settings** → **API**
4. Copy these two values:
   - `Project URL` (e.g., `https://abcdefgh12345678.supabase.co`)
   - `anon public` API Key (starts with `eyJ...`)

## Step 2: Add Credentials to .env.local

Open `.env.local` in the project root and replace the placeholders:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyour-anon-key-here
```

## Step 3: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `src/lib/seed-data.ts` (the `seedSql` string)
4. Click **Run**

This creates:
- `products` table with all 12 products
- `orders` table with 5 demo orders
- Row Level Security policies

## Step 4: Restart Dev Server

```bash
cd lahore-fashion-store
npm run dev
```

## What Happens Now

- ✅ Products load from Supabase (fallback to local if DB is empty)
- ✅ Orders load from Supabase (admin dashboard)
- ✅ Order status updates sync to Supabase
- ✅ Product stock toggles sync to Supabase
- ✅ Cart persists in localStorage (will upgrade to user carts with auth)

## Next Steps (Optional)

### Enable Auth for Customers
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Optionally enable **Google**, **Phone** (OTP)
4. Customers can then create accounts, save addresses, view order history

### Upload Product Images to Supabase Storage
1. Go to **Storage** → **New bucket** → Name it `products`
2. Set bucket to **Public**
3. Upload your product photos
4. Update product `image` fields with Storage URLs

### Deploy to Vercel
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as environment variables in Vercel
2. Deploy — your store is live with a real database!
