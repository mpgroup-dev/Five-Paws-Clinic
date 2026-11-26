# Five Paws Store

Bilingual (EN/AR) pet-supplies e-commerce platform for Saudi Arabia.
Next.js (App Router) + Prisma + PostgreSQL (Neon).

## Setup

```bash
npm install
npx prisma generate
npx prisma db push          # creates tables in the Neon database
npx tsx prisma/seedCategories.ts
npx tsx prisma/seedAdmin.ts     # prints the admin login to use at /admin/login
npx tsx prisma/importProducts.ts   # imports the client's catalog (see below)
npm run dev
```

Storefront: http://localhost:3000 (redirects to /en or /ar)
Admin: http://localhost:3000/admin/login

## What's implemented

- Bilingual EN/AR storefront with RTL/LTR, language switcher, locale persisted via cookie
- Full category/subcategory taxonomy (exact client spec) seeded bilingually
- Product catalog imported from `Five Paws Clinic/images/Products-Organized/final_catalog.xlsx`
  (the already-matched/classified catalog from the earlier image-organization pass), with:
  - Arabic product names generated via brand transliteration + term dictionary (`prisma/arabicTranslation.ts`)
  - Short neutral EN/AR descriptions generated from verified fields only
  - Products missing an image, price, category or confirmed species are imported as **Draft**
    (not visible on the storefront) with a `reviewNote` explaining why
- Product listing with search, filters (category, brand, animal type, price range, in-stock), sorting
- Product detail page with variant/size selector, quantity, related products
- Guest cart (cookie-based, no login) persisted across navigation
- Guest checkout with Saudi mobile validation — **no account required, no COD**
- Order creation (stock is reserved at order time), guest order tracking by secure token
- Admin dashboard: products (CRUD + image upload), categories (view), orders (view/update status),
  coupons (create), settings (shipping/payment/notification status), basic analytics
- Legal/info pages (About, Contact, Privacy, Terms, Shipping, Returns, FAQ) — draft content,
  clearly marked for legal review before go-live

## Explicitly deferred (per client instruction — do not wire without approval)

- **Payment gateway**: not selected yet (Tap / PayTabs / HyperPay / Moyasar). Checkout currently
  creates the order as `PENDING_PAYMENT` / `UNPAID` and shows a "payment is being finalized" message.
  Wiring point: `src/app/api/checkout/route.ts` + a new `src/app/api/webhooks/payment/route.ts`.
- **Notifications**: email/WhatsApp/SMS providers not selected. Settings page shows them as
  "Not configured"; env var placeholders are in `.env.local`.
- **Shipping**: single nationwide zone with placeholder fee (25 SAR, free over 200 SAR) —
  client said to use sensible defaults for now, update in `src/lib/settings.ts` once confirmed.
- **Legal page copy**: drafted by us per client's explicit request; flagged inline for legal review
  (no invented company registration number or physical address).

## Data gaps found during import (see catalog-organization work for full detail)

- 89 products had no matching photo → imported as Draft
- 26 products had an ambiguous species (cat vs dog) → imported with `animalType: CAT_AND_DOG` or
  `UNSPECIFIED` and flagged `needsReview`
- 1 product ("Pet Feeder") had no price in the source Excel → imported as Draft with price 0,
  must be set by the admin before activating

<!-- trigger fresh Vercel build after Root Directory fix -->
<!-- retry after setting Vercel Framework Preset to Next.js -->
