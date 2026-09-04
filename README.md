# Leon Digital Agency — Project Foundation

A high-end, Kenya-based digital agency website modeled on the structural patterns of
coalitiontechnologies.com (trust-stat hero, service grid, animated case studies, comparison
matrix, team wall, FAQ, pricing estimator) — rebuilt with a modern Next.js/Sanity/Postgres stack.

## Stack

- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS + Framer Motion
- **CMS:** Sanity (editorial content: services, case studies, team, testimonials, blog)
- **Database:** PostgreSQL + Prisma (transactional data: portal, leads, projects, bookings, payments)
- **Auth:** Clerk (client portal login)
- **Forms:** React Hook Form + Zod + Resend (transactional email)
- **Payments:** Stripe (international) + M-Pesa STK Push (Kenya)
- **Storage:** Cloudinary
- **Analytics:** GA4 + Microsoft Clarity
- **Scheduling:** Cal.com
- **AI Audit Tool:** Anthropic API + Google PageSpeed Insights API
- **i18n:** next-intl
- **Hosting:** Truehost Kenya (Node hosting) — see deployment notes below

## Why content is split between Sanity and Postgres

Sanity owns anything a non-technical editor updates: page copy, service descriptions, case
studies, team bios, testimonials, blog posts. Postgres owns anything transactional and
per-client: portal accounts, project/milestone tracking, leads from the estimator, bookings,
and payment records. Mixing these creates painful CMS schemas full of "system" fields that
editors shouldn't touch — keeping them separate keeps both simple.

## Phased Roadmap

### Phase 1 — Backend Foundation (current)
- [x] Monorepo structure
- [x] Sanity schema: page, service, caseStudy, industryPage, teamMember, testimonial,
      comparisonMatrix, blogPost, siteSettings + seo/beforeAfter/metric objects
- [x] Prisma schema: Client, Project, Milestone, Lead, Booking, Payment, AuditRequest
- [x] Sanity Studio embedded at `/studio` (own root layout, no marketing chrome)
- [x] Seed script (`npm run seed`) with starter content: site settings, 4 services,
      1 sample testimonial + case study, comparison matrix
- [ ] Sanity project actually created — still needs your project ID + dataset (see Next Step)
- [ ] Postgres provisioned, migrations run
- [x] Clerk auth wired into `(portal)` route group (`middleware.ts` protects `/portal/*`,
      lazy Client-record creation on first login via `lib/get-or-create-client.ts`)

### Phase 2 — Core Marketing Pages
- [x] Design system: "The Ledger" — navy/emerald/gold, Spectral/Inter/Space Mono, hairline-rule motif
- [x] Homepage: Hero, animated trust stats, service grid, case-study ledger, testimonial, CTA
- [x] Global layout: header/nav (mobile menu), footer with sitemap
- [x] Services page (live from Sanity, with fallback) with comparison matrix
- [x] Portfolio index + case study detail template (animated metrics, before/after slider)
- [x] About (team wall with photos + agency story), Contact (form → Lead + Resend notification)
- [x] Blog — `/blog` index + `/blog/[slug]` detail (the `blogPost` Sanity schema existed since
      Phase 1 but had no frontend until now; caught this gap while resuming the build)
- [x] SEO infrastructure: `sitemap.ts` (static + dynamic case study routes), `robots.ts`,
      Organization JSON-LD (every page) + CreativeWork JSON-LD (case studies), per-page metadata
- [x] Query layer (`lib/sanity.queries.ts`) — tries Sanity, falls back to sample-data.ts automatically

**Orphaned-schema audit (found after a "is anything else built-but-unwired" pass):**
Three Sanity schema types were defined and even seeded, but never actually fetched
by any page — editing them in Studio would have silently done nothing:
- `siteSettings.trustStats` — the homepage trust-stats bar was hardcoded to
  `sample-data.ts` regardless of what was set in Studio. Fixed: `getSiteSettings()`
  now feeds it, and the Contact page's phone/email/address too.
- `testimonial` — the homepage testimonial block was permanently frozen on one
  hardcoded quote. Fixed: `getFeaturedTestimonial()` pulls the most recent one.
- `page` (the generic section-based page builder: hero/trustStats/serviceGrid/
  featuredCaseStudies/testimonialSlider/faq/richText/ctaBanner) had zero frontend
  route at all. Fixed: `components/PageSections.tsx` renders each section type,
  and `app/(marketing)/[slug]/page.tsx` is a catch-all that only matches when no
  static route claims the slug first (Next.js prioritizes static segments, so
  `/services`, `/about`, etc. are unaffected). This means Studio can now create
  genuinely new landing pages without a code deploy — e.g. a one-off campaign page.

### Phase 3 — Advanced Features
- [x] Interactive project estimator (multi-step form, live-updating price range,
      React Hook Form + Zod, → Lead record in Postgres + Resend email notification)
- [x] Before/after portfolio comparisons (`BeforeAfterSlider` — drag/touch, clip-path based, graceful placeholder when no image yet)
- [x] Animated case studies (scroll-triggered metric counters, `AnimatedMetricRow`, reused on homepage + case study pages)
- [x] Service comparison matrix (from `comparisonMatrix` schema)
- [x] Industry-specific landing pages (Tourism, Healthcare, Real Estate, Hospitality — `/industries` index + `/industries/[slug]` template, pain points + relevant case studies)
- [x] Multilingual support (English / Swahili) — see "A note on the multilingual setup" below for exactly what's translated so far

### Phase 4 — Client Portal & Conversion Systems
- [x] Client portal: project tracking, milestone timeline, Clerk-gated (`/portal`)
- [x] Success metrics dashboard (Recharts, `/portal/metrics` — sample data shaped
      like the GA4 Data API response; swap `lib/metrics-data.ts` for the real call once configured)
- [x] Booking & onboarding flow — Cal.com embed at `/book` → `BOOKING_CREATED` webhook
      (signature-verified) creates a `Booking` row → authenticated `/portal/onboarding`
      form creates the `Project` + starter milestone template
- [x] AI-powered website audit tool — `/audit-tool`: Google PageSpeed Insights (performance/
      SEO/accessibility/best-practices) + Claude-written summary and recommendations,
      persisted as an `AuditRequest`, emailed to the requester via Resend
- [x] Deposit payments — Stripe (card, USD, signature-verified webhook) + M-Pesa
      (STK Push, KES). Both: Payment row created server-side before the provider
      is ever called, ownership of the project re-checked server-side (never
      trust a projectId from the client), webhooks are idempotent against
      re-delivery, and a successful first deposit auto-advances the project from
      ONBOARDING → DESIGN. See "A note on M-Pesa callback security" below.

### Phase 5 — Launch
- [ ] Performance pass (Core Web Vitals, image optimization via Cloudinary)
- [ ] Analytics wired (GA4 + Clarity)
- [ ] Truehost deployment pipeline (or Vercel + Truehost DNS, see note)
- [ ] QA across devices, accessibility pass

## Routing structure — read before touching layouts

This app deliberately has **two independent root layouts**, not one shared layout:

- `app/(marketing)/layout.tsx` — defines `<html>`/`<body>`, loads fonts, renders `Header`/`Footer`. Everything public-facing lives under `(marketing)`.
- `app/(studio)/layout.tsx` — its own `<html>`/`<body>`, no header/footer, no fonts. The Sanity Studio at `/studio` renders full-screen and must not inherit marketing chrome.
- `app/(portal)/layout.tsx` — its own `<html>`/`<body>`, wraps everything in `ClerkProvider`. The actual sidebar/topbar dashboard chrome lives one level deeper at `app/(portal)/portal/(dashboard)/layout.tsx` — a nested (non-root) layout — so that `/portal/sign-in` and `/portal/sign-up` render full-screen without the dashboard sidebar, while `/portal`, `/portal/projects`, and `/portal/metrics` get it.

There is intentionally **no top-level `app/layout.tsx`** — in Next.js App Router, once you need genuinely different shells (a marketing site vs. an embedded full-screen tool), you give each top-level route group its own root layout instead of nesting a partial layout under a shared one. Do not add a shared root layout back and try to make `(studio)` "opt out" of it — that's the layout-duplication trap. When the `(portal)` client-portal route group gets built next, it should follow the same pattern if its shell differs from the marketing site (e.g. a dashboard sidebar instead of the marketing header).

## A note on the multilingual setup

This uses `next-intl` in **cookie-based mode**, not the path-prefixed routing mode
(`/en/...`, `/sw/...`). That was a deliberate tradeoff: path-prefixed routing means
restructuring every route under `app/(marketing)/[locale]/...`, which would have
meant rebuilding every page already built in this project from scratch. Cookie-based
mode keeps all existing URLs exactly as they are — `LanguageSwitcher.tsx` sets a
`NEXT_LOCALE` cookie and refreshes; `i18n/request.ts` reads that cookie server-side
on every request.

**Supported languages:** English, Kiswahili, French, German, Spanish, Portuguese,
and Italian (`messages/en.json`, `sw.json`, `fr.json`, `de.json`, `es.json`,
`pt.json`, `it.json`). All are left-to-right — no RTL languages (Arabic, Hebrew,
etc.) are included. Adding one is only a translation-file change; the styling
itself would need real work (logical CSS properties or `dir="rtl"` handling, since
this design leans on directional details like right-aligned ledger figures) before
an RTL language would look right rather than just read correctly.

**What's actually translated right now:** Header nav, the language switcher itself,
Footer, the homepage Hero, and the CTA banner. **What's not yet translated:**
Services, Portfolio/case studies, About, Contact, Industries, the estimator, and
everything in the portal — these still render English-only regardless of the
selected language. That's a real gap, not a finished feature quietly limited in
scope: extend it by adding keys to all seven message files and swapping hardcoded
strings for `useTranslations()` calls in each component, following the pattern in
`Hero.tsx` or `Footer.tsx`. Sanity content (case study copy, service descriptions)
would need field-level localization in the schema (Sanity supports this via an
array-of-locales pattern) — that's a schema change, not just a translation file
change, and hasn't been done here.

If a future rebuild has time to redo full path-prefixed routing (`/sw/services`
etc.), that's the more standard next-intl setup and gives locale-specific SEO URLs
— worth it if international SEO matters more than avoiding the rebuild cost.

## A note on M-Pesa callback security

Stripe cryptographically signs every webhook, so `app/api/webhooks/stripe/route.ts`
can prove a request really came from Stripe before trusting it. Safaricom's Daraja
API does **not** sign STK Push callbacks the same way — there's no equivalent
signature header to verify. The M-Pesa webhook handler compensates by:
1. Never trusting an amount from the callback body — it only ever writes a
   *status* (SUCCESS/FAILED) against a Payment row whose amount was already
   set server-side when the STK push was initiated.
2. Being idempotent — Safaricom retries callbacks, and re-processing a payment
   that's already resolved is a no-op.

Before going to production, also: (a) don't publish the callback URL anywhere
public, (b) ask Truehost/your infra provider whether you can restrict inbound
traffic to that specific route to Safaricom's published IP ranges, and (c)
reconcile daily against the Safaricom portal's transaction log rather than
trusting the callback as the sole source of truth for real money.

## A note on Truehost hosting

Truehost Kenya's shared/VPS hosting works for static exports but a full Next.js app with
API routes, ISR, and webhooks needs a Node runtime. Two realistic paths:
1. **Truehost VPS/Cloud plan** with Node.js support — full control, but you manage the
   process (PM2), reverse proxy (Nginx), and SSL yourself.
2. **Vercel for the app + Truehost for DNS/email** — much less ops overhead, and Truehost
   still handles your `.co.ke` domain and business email.
We'll confirm which once we're closer to Phase 5 — it affects nothing in Phases 1-4.

## Next step

Phase 1 needs: (a) a Sanity project ID/dataset created, (b) a Postgres instance (Neon,
Supabase, or Truehost-hosted Postgres), (c) brand direction for Leon Digital Agency itself
(color palette, typography, tone — separate from the JT Malika "Field Journal" identity,
since this is the agency's *own* site).
