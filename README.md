# IGO Import & Export

India's managed agri-commodity trade desk — a Next.js + Firebase B2B platform connecting international buyers with verified Indian sellers of agricultural inputs, seeds, nursery plants, and export-ready commodities. Sourcing, quality inspection, export documentation, and freight are handled by IGO's trade desk; the site itself runs the product catalog, seller onboarding/approval, buyer accounts, and quote-based ordering.

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Firebase (Authentication, Firestore, Storage) — client SDK only, no custom server/API layer beyond one route
- **Auth:** Firebase Authentication (email/password), three roles: `admin`, `seller`, `buyer`
- **Icons:** Font Awesome (via CDN link in the root layout)
- **Translation widget:** Google Translate (client-side dropdown, not true i18n — see Known Limitations)
- **Hosting target:** Vercel-style Next.js hosting (no server framework beyond Next's own API routes)

## Database & Auth

Firestore collections in use:

| Collection | Purpose |
|---|---|
| `users` | One doc per account, keyed by Firebase Auth UID. Holds `role` (`admin`/`seller`/`buyer`), email, company info, `isActive` flag for sellers. |
| `products` | Seller-submitted marketplace listings. Each has a `status` (`pending`/`approved`/`rejected`) driven by the admin approval workflow, plus `price`/`priceUnit` (real, seller-entered). |
| `orders` | Checkout submissions. Guest checkout is allowed (no login required), so creation is intentionally open; reading a specific order is restricted to its buyer or an admin. |
| `notifications` | In-app notifications (order placed, status changed, product approved/rejected, etc.), read via the bell icon in the navbar. |
| `admin_logs` | Audit trail of admin actions (approve/reject/deactivate), admin-only. |
| `settings` | Site-wide settings doc (auto-approve toggle, seller welcome message). Readable by anyone (needed by the seller dashboard), writable only by admins. |

Firestore security rules (`firestore.rules`) are role-based: sellers can only create/edit their own pending listings and can't self-approve; buyers/sellers can't self-promote to admin; order and notification records are only readable by their owner or an admin.

There is also a **static catalog** at `public/data/products.json` (356 items — Crop Care, Nursery, and related agri-inputs) used as a fallback/seed view whenever there are no approved Firestore listings yet. It has no price data by design (see Known Limitations).

## Features

- Public storefront: homepage, About, Services, Brands, Offers, Clients, Certificates, Gallery, Contact
- Live product catalog (`/hub/agriculture`) with search, category filtering, and per-category deep links from the homepage
- Category landing pages (`/category/[slug]`) that filter the real catalog by category, with a graceful fallback to the full catalog if nothing matches yet
- Three-role auth: buyer, seller, admin — separate login/register flows and dashboards
- Seller dashboard: submit/edit product listings, track pending/approved/rejected status, see admin notes
- Admin dashboard: approve/reject/bulk-approve listings, manage seller accounts (activate/deactivate), view/update order status, activity log, CSV export, site settings
- Buyer dashboard: order tracking, RFQ history
- Cart + quote-based checkout (guest checkout supported) — this is a "request a quote" flow, not a live payment checkout (see Known Limitations)
- Indicative pricing: product cards show a seller-entered price as "Indicative — final quote on request" when available, otherwise "Quote on Request"
- WhatsApp-integrated contact form and RFQ requests (opens a pre-filled `wa.me` link)
- In-app notification system (order placed, status updates, product approvals)
- Honeypot + submit-throttle spam protection on the contact and checkout forms
- SEO: per-page metadata, `sitemap.xml`, `robots.txt`, JSON-LD `Organization` structured data
- Branded 404 / error / loading states

## Project Structure

```
src/
├── app/
│   ├── about/ · services/ · brands/ · offers/ · clients/ · certificates/ · gallery/
│   │   └── each has its own page-level metadata
│   ├── admin/                # redirects straight to /login/admin (not linked in nav)
│   ├── api/
│   │   └── seed-admin/       # one-time admin bootstrap, secret-token protected (see below)
│   ├── category/[slug]/      # category landing pages, real-data driven
│   ├── checkout/             # cart + quote-request flow (layout.tsx sets noindex)
│   ├── contact/              # WhatsApp-based inquiry form + layout.tsx for metadata
│   ├── dashboard/
│   │   ├── admin/  buyer/  seller/   # role-gated dashboards (layout.tsx sets noindex)
│   ├── hub/agriculture/      # the live/full product catalog page
│   ├── login/  register/     # admin / buyer / seller auth flows
│   ├── layout.tsx            # root layout: fonts, providers, JSON-LD, metadataBase
│   ├── page.tsx              # homepage
│   ├── not-found.tsx · error.tsx · loading.tsx
│   └── globals.css
├── components/
│   ├── auth/                 # LoginForm, LoginLayout
│   ├── home/                 # Hero, Products, Services, Process, Stats, Footer, Navbar helpers, etc.
│   ├── hub/                  # AgricultureHubClient (shared by /hub/agriculture and /category/[slug])
│   ├── layout/                # Navbar, GoogleTranslate widget, NotificationBell
│   └── ui/                   # shared primitives (button, etc.)
├── context/                  # AuthContext, CartContext, NotificationContext
├── lib/                      # firebase.ts, authService, productService, orderService,
│                              # notificationService, inquiryService, whatsapp.ts
└── types/                    # product.ts (SellerProduct, AdminLog, category/price-unit constants)

public/
├── data/products.json        # 356-item static catalog (no price field — see Known Limitations)
├── products/                 # real product photography, organized by brand/category
├── images/                   # hero/gallery imagery
├── sitemap.xml · robots.txt
```

> **Note on `igo-marketplace/`:** there is a second, older, abandoned copy of this project nested inside the repo root, with its own `package.json` and git history. It predates several features that now only exist in the real app (admin approval workflow, notifications, order tracking) and its last commit added cosmetic-only "advanced" features (a fake hardcoded price ticker, fake "Verified"/"Organic" badges, non-functional filter dropdowns) that were never wired to real data. It's excluded from `tsconfig.json` and `eslint.config.mjs` so it doesn't interfere with builds/linting, but it still physically exists in the repo and should be deleted once someone confirms it's safe to remove (it wasn't deleted here — file deletion in that folder wasn't authorized during this session).

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Firebase project (Authentication + Firestore + Storage enabled)

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and fill in your Firebase project's values (Firebase Console → Project settings → General → Your apps):
   ```bash
   cp .env.local.example .env.local
   ```
3. Deploy the Firestore rules from `firestore.rules` to your Firebase project (via the Firebase Console or `firebase deploy --only firestore:rules`).
4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Firebase client config |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional | Firebase Analytics |
| `ADMIN_SEED_SECRET` / `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` | Only when bootstrapping | One-time admin account creation — set these, `POST /api/seed-admin` with header `x-seed-secret`, then unset them. There is no other way to create the first admin account. |

`src/lib/firebase.ts` throws a clear startup error if the required Firebase variables are missing — there are no hardcoded fallback keys in source anymore.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run the dev server (Turbopack) |
| `npm run build` | Build for production |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint (flat config — `eslint.config.mjs` is the active config; `.eslintrc.json` is a legacy leftover, see below) |

## Project Status & Known Limitations

This is a working, feature-rich platform — not a prototype — but it's a quote-desk, not a fully transactional e-commerce store. Read this before assuming a feature exists.

**Checkout is quote-only, on purpose.** There is no payment gateway integration. Submitting the checkout form creates an `orders` doc with `pricingStatus: 'quote_requested'` and no fabricated total — IGO's team follows up manually with real pricing. If real checkout payments are ever needed, that's a deliberate product decision to make (Razorpay/Stripe, escrow-style holds, etc.), not a bug to silently "fix."

**Pricing is mostly indicative, not firm.** Seller-submitted listings have a real `price`/`priceUnit` field shown as "Indicative — final quote on request." The 356-item static catalog (`public/data/products.json`) has no price data at all and shows "Quote on Request." Do not backfill that file with invented numbers — get real figures from the business first.

**No individual product detail pages.** The catalog is card/grid only; there's no dedicated route per product with full specs and its own metadata.

**Contact/RFQ forms don't hit a backend.** They open a pre-filled WhatsApp link (`wa.me`). If the visitor doesn't have WhatsApp, or the popup is blocked, the message isn't captured anywhere else — there's no email fallback or stored inquiry record.

**Translation is a widget, not real i18n.** The language switcher toggles Google's client-side translate widget. It doesn't produce translated routes or translated metadata, so translated content isn't separately indexable by search engines.

**Some marketing pages still use stock (Unsplash) imagery** — About, Clients, Offers, the homepage category grid, and a couple of home-page sections. Real product photography already exists for the actual catalog; these are the pages still using placeholder stock photos.

**No automated tests.** Every change so far has been verified by manual review — there's no unit/integration/e2e test suite for the checkout, approval, or auth flows.

**Two pieces of dead weight need manual deletion** (couldn't be removed programmatically in this session — file deletion wasn't authorized):
- `src/app/category/[slug]/src/lib/firebase.ts` — an empty, misplaced stray file from an old refactor.
- `.eslintrc.json` — a legacy config file superseded by `eslint.config.mjs`; its rules were already migrated into the flat config, so this file is now inert and safe to delete.
- The whole `igo-marketplace/` folder (see the Project Structure note above) — bigger decision, needs sign-off before deleting a folder with its own git history.

**Admin bootstrap is intentionally awkward.** `/api/seed-admin` is a POST-only route gated by `ADMIN_SEED_SECRET` specifically so it can't be triggered by anyone who finds the URL (it used to be a public GET route with a hardcoded password — that was a real vulnerability, now fixed). There is no admin panel for creating additional admins; that would need to be built if more than one admin account is ever needed.

## Suggested Next Steps for Whoever Picks This Up

Roughly in priority order:

1. **Decide the payment model.** Confirm with the business whether checkout should stay quote-only forever, or whether real payments (Razorpay/Stripe, possibly with escrow-style holds like competitors' "trade assurance") are wanted. Everything downstream of pricing depends on this decision.
2. **Add individual product detail pages** — a `/hub/agriculture/[id]` (or similar) route with full specs, certifications, and its own SEO metadata per product. This is the single biggest feature gap versus competitor B2B platforms (IndiaMART, TradeIndia, Alibaba, ExportersIndia all do this).
3. **Real seller analytics** — inquiry/view counts on the seller dashboard. The data already exists in Firestore; it just isn't surfaced yet.
4. **A real RFQ board** — right now a buyer's "Request Quote" is a one-way WhatsApp ping to IGO. A proper multi-seller RFQ system (buyer posts a requirement, relevant sellers see and respond to it) would match how TradeIndia/IndiaMART/Alibaba actually operate.
5. **Order/shipment tracking with milestones** (booked → customs cleared → in transit → delivered) on the buyer dashboard — currently only a status string.
6. **Privacy Policy and Terms of Service pages** — currently missing entirely; needed for legitimacy with international buyers and likely required depending on which countries your buyers are in.
7. **Replace remaining stock photography** on About/Clients/Offers/homepage sections with real brand photography — real product images already exist for the catalog itself.
8. **Real multi-currency display** (USD/EUR/AED alongside INR) if actively courting non-Indian buyers.
9. **Basic automated tests** for checkout, product approval, and auth — these are the flows most likely to silently break and hardest to catch by eye.
10. **Clean up dead weight**: delete the abandoned `igo-marketplace/` folder (after sign-off), the stray empty file, and the legacy `.eslintrc.json`.
11. **If a live commodity price ticker is genuinely wanted**, source it from a real feed (e.g. Agmarknet/APMC data) rather than hardcoding numbers — a fake ticker existed in the abandoned `igo-marketplace/` branch and should not be reintroduced.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
