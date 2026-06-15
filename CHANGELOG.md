# Changelog

## 2026-06-12

### Fixes and improvements

#### Infrastructure

- **TanStack Start dev server**: SaaS and marketing server entries now use `createServerEntry` and forward the first request pass into the SSR Vite environment via an `x-ssr-dispatch` header. In dev, Nitro runs the entry in its own environment where TanStack Start's server-function resolver is not wired, so `/_serverFn/` calls previously returned 500 with `Cannot read properties of undefined (reading 'method')`. Server functions now resolve in the SSR environment in both dev and production.

#### Continuous integration

- **End-to-end tests**: Marketing Playwright config uses `import.meta.url` instead of `__dirname` so CI can load the ES module package. The SaaS dev server falls back to a dummy `DATABASE_URL` when unset so e2e can boot without a live database.

---

## 2026-06-02

### Fixed

#### Organizations

- **Hide delete organization for non-owners (SUP-33)**: The "Delete Organization" section in organization general settings is now only visible to members with the `owner` role. Non-owner admins can still access all other organization settings.

#### SaaS app

- **Avatar and organization logo settings**: Added delete actions for user avatars and organization logos in general settings, plus the matching English translations so both image-management flows are internally consistent.

### Security

#### Auth

- **Magic-link open redirect**: Replaced `trustedOrigins: ["*"]` in `packages/auth/auth.ts` with an explicit allow-list of the app's own origins. The wildcard disabled better-auth's origin/callback validation, allowing an attacker-controlled `callbackURL` to drive an open redirect out of the magic-link verify flow while a valid session cookie was set on the legitimate domain.
- **Shared trusted origins**: Added a `getTrustedOrigins()` helper in `@repo/utils` (SaaS app origin plus the marketing origin when `VITE_MARKETING_URL` is set) and used it as the single source of truth for both better-auth's `trustedOrigins` and the API CORS allow-list in `packages/api`, so the two can no longer drift apart.
- **Username enumeration**: Removed the `username()` better-auth plugin, which exposed an unauthenticated `POST /api/auth/is-username-available` account-enumeration endpoint. The now-unused `username` and `displayUsername` columns were dropped from the `user` table across the Postgres, MySQL, and SQLite schemas (run `pnpm --filter @repo/database db:generate` and apply the migration).

---

## 2026-05-27

### Changed

#### Infrastructure

- **Node.js and pnpm**: Upgraded from pnpm 10 to `pnpm@11.3.0`, moved `onlyBuiltDependencies` into `pnpm-workspace.yaml` `allowBuilds`, and now require Node.js `>=22`. Turborepo was upgraded to the latest 2.9.x release.
- **Prisma installs**: Disabled postinstall builds for `prisma` and `@prisma/engines` in `allowBuilds` so installs stay fast while Prisma clients are still generated through the database package scripts.
- **Dependabot**: Switched the npm ecosystem schedule from weekly to daily and removed the open-pull-requests limit.
- **Root scripts**: Removed duplicate root-level `db:*` and `user:create` shortcuts; run database and script tasks via `pnpm --filter @repo/database` or `pnpm --filter @repo/scripts` instead.

#### SaaS app

- **Dependencies**: Removed the unused `oslo` package from the SaaS app.

---

## 2026-05-25

### Fixes and improvements

#### Payments

- **Stripe one-time checkout**: Creating a checkout link for a user or organization that already has a Stripe customer no longer sends `customer_creation` alongside `customer`, which Stripe rejects with a parameter conflict error.

---

## 2026-05-21

### Fixes and improvements

#### SaaS app

- **Organization members**: Role selects are ordered member → admin → owner (least to most access). The members settings page includes a role permissions summary, and each role option shows a short description of what it can do.

#### Internationalization

- **Organization role UI**: Member-role hooks and the roles info panel now use the shared `@i18n/intl` formatting helpers instead of `next-intl` imports so the TanStack SaaS app passes oxlint and matches the rest of the workspace.

---

## 2026-05-20

### Removed

#### Mail

- **NewUser template**: Removed the unused `NewUser` email template, its `mailTemplates` registration, and related `mail.json` copy (including `common.otp`) because signup and email changes use `emailVerification` instead.

---

## 2026-05-18

### Changed

#### Mail

- **React Email 6**: The mail package uses the unified `react-email` package (v6). Scoped `@react-email/components` and `@react-email/render` dependencies were removed in favor of imports from `react-email`. The mail preview app replaces `@react-email/preview-server` with `@react-email/ui` per the v6 upgrade guide. Email templates were reformatted with oxfmt.

### Fixed

#### Internationalization

- **TanStack Start paths**: Locale helpers now treat `/_serverFn` like other framework internals so server function traffic is not mistaken for a missing locale prefix during routing and prefetch.

---

## 2026-05-11

### Added

#### SaaS app

- **Admin area**: Added the admin route shell and matching navbar navigation for the admin users section.

### Changed

#### Notifications

- **Preferences**: Account notification settings align with the Next.js starter, including grouped per-type preferences, matching oRPC procedures, Drizzle-backed preference storage, and updated SaaS translations.

#### Continuous integration

- **Verify pipeline**: Marketing content collections generate before oxlint so type-aware lint resolves the virtual module, with formatting and lint cleanups on touched files.

### Fixed

#### Routing and authentication

- **TanStack Start routing**: Updated file-based routing, invitation flows, and Nitro server entries so marketing and SaaS SSR route through the shared service reliably (including Vercel builds).

- **Authentication**: Stabilized SaaS auth redirects, corrected auth form submissions, and surfaced magic link errors on the login form.

#### Settings

- **Account and onboarding**: Moved delete-account controls into general settings, simplified organization general settings, and aligned the onboarding page layout with the shell.

---

## 2026-05-10

### Added

- TanStack Start parity routes for `robots.txt`, generated marketing sitemap output, and private avatar or logo image proxying.
- `@repo/notifications` with notification creation helpers, link resolution, welcome notifications, and notification email support.
- Marketing analytics provider examples for Google Analytics, Mixpanel, PostHog, Vercel Analytics, and custom integrations.

### Fixed

- Restored last-active organization persistence through Better Auth session hooks and Drizzle schema support.
- Added organization membership checks before reading organization purchases or creating organization checkout links.
