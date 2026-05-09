# Changelog

All notable changes to this starter kit will be documented in this file.

## [Unreleased]

### Pipeline

- `pnpm verify`, `pnpm type-check`, `pnpm build`, and `pnpm test` are green
  from a clean checkout. CI now gates every PR on all five (lint + format,
  type-check, build, unit, e2e).
- Removed the shared Paraglide output race that made `saas` builds fail with
  1000+ MISSING_EXPORT errors. Apps now consume the compiled modules from
  `@repo/i18n/paraglide/*` instead of re-running `paraglideVitePlugin`.

### ORM

- Removed the half-wired alternate ORM path (generated client was missing,
  schemas were duplicated with Drizzle, and type-check cascaded to failure
  across 7 packages). Drizzle is now the sole ORM. `@repo/database` exposes
  `db:generate`, `db:migrate`, `db:push`, `db:studio` via drizzle-kit.
- Fixed `packages/database/drizzle/schema/index.ts` to re-export the
  PostgreSQL tables (used to point at SQLite, which made `drizzle-zod`
  schemas silently sqlite-typed).

### Forms

- Standardized every form in the monorepo on `@tanstack/react-form + zod`.
  The UI package's `<Form>` primitives are built directly on
  `@tanstack/react-form`. Every saas form (auth, settings, organizations,
  admin, onboarding) and every marketing form (contact, newsletter) has
  been migrated off `react-hook-form`. `react-hook-form` and
  `@hookform/resolvers` are no longer in the workspace. Zod 4 is a
  Standard Schema, so `validators: { onSubmit: schema }` is consumed
  directly — no adapter package.

### i18n

- Deleted the bespoke saas `useTranslations` JSON-bundle shim. Calls resolve
  directly against Paraglide's compiled messages now; `IntlProvider` is
  gone, as is the per-request messages loader in the root route.

### Providers

- Payments and mail providers are runtime-selectable via `PAYMENT_PROVIDER`
  and `MAIL_PROVIDER`; unused providers are lazy-loaded and unknown values
  fall back to safe defaults with a logged warning.
- Analytics: removed five unwired providers (posthog/mixpanel/vercel/custom/
  google) and finished wiring plausible/umami/pirsch with env-guarded script
  loaders. A new `<AnalyticsScript />` in the marketing root dispatches by
  `VITE_ANALYTICS_PROVIDER`.

### Auth

- Decoupled `requireEmailVerification` from `enableSignup` (previously
  coupled: invitation-only setups couldn't require verified emails).
- Added a Better Auth `before` hook on `/organization/create` and
  `/organization/update` that rejects reserved slugs server-side; extended
  the list to cover `onboarding`, `checkout-return`, `choose-plan`, `api`.
- `trustedOrigins` and Hono CORS now include `VITE_MARKETING_URL` when set.
- Session reads stop passing `disableCookieCache: true` on every read;
  writes still bypass the cache via `reloadSession()`.

### API

- Hono `secureHeaders` middleware with sensible defaults (HSTS in prod,
  X-Frame-Options, XCTO, strict referrer policy).
- Tightened the `/ai/stream` input schema from `z.any()` to an actual
  `UIMessage` shape with length caps.
- Removed unused `openapi-merge` helper and dead `getOrganizationById`
  export.

### UI / UX

- Added `errorComponent` and `notFoundComponent` to the saas root.
- `DeleteAccountForm` is now wired into the `/settings/security` page inside
  a destructive-styled danger-zone card.
- `checkout-return` shows a timed-out retry/"choose plan" UI instead of
  silently bouncing users after 20s.
- Fixed every oxlint warning (11 → 0): empty heading elements, nested
  labels, exhaustive-deps, unbound-method, missing `lang` in docs root.

### Dev experience

- Turbo `globalEnv` whitelisted (was `*`, killing cache reuse).
- Root-level `db:*` and `user:create` scripts.
- `.nvmrc` targets Node 22. `@types/node` catalog bumped from Node 25
  (prerelease) to Node 22 LTS.
- Moved `apps/saas/tests/` → `apps/saas/e2e/` and added a Vitest config
  that excludes `e2e/**` so Playwright specs no longer hang the unit runner.
- Removed the committed `apps/saas/test-results/` directory and updated
  `.gitignore` to keep it out.
- Rewrote the README with a real quickstart, command reference, and
  deployment notes. Seeded this changelog.

### Security / storage

- Storage signed PUTs now pin `Content-Type` in `signableHeaders` so S3
  rejects uploads whose MIME doesn't match the file extension.
- Logging routed through `@repo/logs` instead of `console.error` in the
  client oRPC interceptor and the pricing table checkout flow.
