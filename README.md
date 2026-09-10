# 26c

Graphic tee ecommerce storefront — Next.js, Prisma/SQLite, Razorpay checkout, Google sign-in, and an admin dashboard for order/inventory management.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in the values
npx prisma migrate dev
npm run dev
```

See `.env.local.example` for the required environment variables (Razorpay, NextAuth/Google, Resend, admin session secret).

Admin dashboard: `/admin/setup` (one-time, creates the first admin login), then `/admin`.
