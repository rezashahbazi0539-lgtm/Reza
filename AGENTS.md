# City Nail - E-Commerce Platform

## Overview
Premium Turkish Nail Art e-commerce platform built with Next.js 14 (App Router), Prisma + SQLite, and Tailwind CSS.

## Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, lucide-react icons, recharts
- **Backend**: Next.js API Routes (App Router)
- **Database**: SQLite via Prisma ORM
- **Auth**: JWT-based with bcrypt password hashing

## Setup
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
The container auto-runs: `npm install` → `prisma generate` → `prisma db push` → `seed` → `next dev`

## Demo Accounts
- **Admin**: admin@citynail.com / admin123
- **Customer**: zeynep@example.com / user123

## Key URLs
- Storefront: `/`
- Shop: `/magaza`
- Product: `/urun/[slug]`
- Cart: `/sepet`
- Checkout: `/odeme`
- Account: `/hesabim`
- Wishlist: `/favorilerim`
- Blog: `/blog`
- Admin: `/admin`

## Architecture Notes
- Cart & wishlist use client-side localStorage via React Context
- Admin routes are protected by role check (ADMIN/SUPER_ADMIN)
- All UI text is in Turkish, centralized in `lib/translations.ts`
- Homepage content is CMS-driven via `HomepageSection` records
- Payment abstraction layer supports future iyzico/PayTR/Stripe integration
- Coupon system supports PERCENTAGE, FIXED, and FREE_SHIPPING types
