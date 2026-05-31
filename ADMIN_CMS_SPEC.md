# Apna Admin CMS — Phase 1: Product CMS

## Overview
Replace hardcoded product data with a full CRUD product management system.
Admin can create, edit, delete products entirely from the UI.

## New Supabase Storage Setup

### 1. Create Storage Bucket
- Name: `products`
- Public: ✅ Yes
- Allowed file types: `image/*`
- Max file size: 5MB

## New Supabase Table: `products` (Already exists, will extend)

Current schema is good. No changes needed.

## New Pages

### `/admin/products/new` — Create Product
Form fields:
- **Name** (text, required)
- **Price** (number, required)
- **Original Price** (number, optional — for sale items)
- **Category** (select: Men / Women / Traditional / Accessories)
- **Description** (textarea, required)
- **Sizes** (multi-select chips: XS, S, M, L, XL, XXL, One Size, 6-11)
- **Colors** (dynamic: add color name + Tailwind class, e.g. "Ivory" → "bg-stone-100")
- **Badge** (select: None / Best Seller / New Arrival / Limited / Sale / Bridal)
- **Stock** (toggle: In Stock / Out of Stock)
- **Images** (multi-upload to Supabase Storage, max 5 images)
  - First image = primary (used in grids)
  - All images = gallery on product page

### `/admin/products/edit/[id]` — Edit Product
- Pre-populate form with existing product data
- Show current images with delete option
- Allow adding new images
- Save updates to Supabase

### `/admin/products` — Product List (Enhance existing)
Add to existing page:
- "Add New Product" button → `/admin/products/new`
- "Edit" link per product → `/admin/products/edit/[id]`
- "Delete" button with confirmation dialog

## Server Actions

### `createProduct(formData)`
1. Upload images to Supabase Storage bucket `products`
2. Get public URLs
3. Insert product row into `products` table
4. Return product ID

### `updateProduct(id, formData)`
1. Upload new images if any
2. Delete removed images from Storage
3. Update product row

### `deleteProduct(id)`
1. Delete all product images from Storage
2. Delete product row from table

## Components Needed

| Component | Purpose |
|-----------|---------|
| `ProductForm` | Shared form for create/edit |
| `ImageUploader` | Multi-file upload with preview, delete, reorder |
| `ColorPicker` | Add/remove color name + Tailwind class pairs |
| `SizeSelector` | Multi-select chip input |
| `ConfirmDialog` | Reusable delete confirmation |
| `Toast` | Success/error notifications |

## UI/UX

- Form layout: 2-column on desktop, stacked on mobile
- Left column: basic info (name, price, category, badge, stock)
- Right column: description, sizes, colors, images
- Save button: sticky at bottom
- Auto-save draft to localStorage (optional)
- Image upload: drag-and-drop zone with previews

## File Structure

```
src/
  app/admin/products/new/page.tsx
  app/admin/products/edit/[id]/page.tsx
  components/admin/
    ProductForm.tsx
    ImageUploader.tsx
    ColorInput.tsx
    SizeSelector.tsx
  lib/actions/
    products.ts  (extend with createProduct, updateProduct, deleteProduct)
```

## Acceptance Criteria

- [ ] Admin can create a new product with all fields
- [ ] Admin can upload up to 5 product images
- [ ] Admin can edit any existing product
- [ ] Admin can delete a product with confirmation
- [ ] New product appears immediately in shop
- [ ] Images display correctly on shop and product pages
- [ ] Form validation shows clear error messages
- [ ] Success toast appears after save
