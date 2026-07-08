# TODO — Driver Platform

> Live task tracker. See `ARCHITECTURE.md` for the full plan and rationale.
> Mark items `[x]` as they land; add discovered work under the right phase.

**Repos:** SaaS/dashboard/API: `robot9s/driver-platform` (main auto-deploys to
Railway — merge deliberately). Mobile: `robot9s/driver-platform-expo-app`
(NativeLaunch boilerplate + `moneyra-template` premium base to gut & rebrand;
docs: https://nativelaunch.dev/docs — archive a copy into that repo).

## Phase 0 — Foundation

- [ ] Decide platform name; update `apps/saas/config` + `apps/marketing/config` branding
- [x] Environment setup: `.env.local` wired to Railway Postgres + buckets, schema applied (`pnpm --filter @repo/database push`); mail/AI keys still pending
- [x] Add `userType` (`driver` | `company_member`) additional field to Better Auth user (`packages/auth/auth.ts`, `user.userType` column)
- [ ] Route company signups through existing org onboarding; driver signups skip org creation
- [ ] Seed script: sample drivers, certifications, companies for local dev

## Phase 1 — Driver domain (schema + API)

- [x] Drizzle schema: `driverProfile`, `driverExperience`, `driverCertification`, `driverDocument`, `truck` (postgres schema + relations + zod select schemas)
- [x] Certification taxonomy union type + zod schemas in `packages/api/modules/drivers/types.ts`
- [x] Query helpers in `packages/database/drizzle/queries/drivers.ts`
- [x] oRPC module `drivers`: `getMyProfile`, `upsertProfile`, experience/certification/document/truck save+delete (all ownership-scoped, wired into `orpc/router.ts`)
- [x] S3 presigned upload procedure (`drivers.documentUploadUrl`, private `documents` bucket, per-user path)
- [x] Apply schema to Railway Postgres (`db push`; switch to generated migrations once the schema stabilizes)
- [x] Create private `documents` bucket (Railway object storage) + `VITE_DOCUMENTS_BUCKET_NAME` env; per-bucket credential overrides in `packages/storage` (`S3_DOCUMENTS_ACCESS_KEY_ID`/`SECRET`) since Railway scopes S3 keys per bucket

## Phase 2 — Company dashboard (apps/saas)

- [ ] `companyProfile` schema + org settings extension UI (DOT/MC/NSC, fleet size, regions)
- [ ] `drivers.search` procedure: filters (cert type, experience, truck/trailer type, province/region, employment preference, availability) + full-text
- [ ] Driver search page: filter sidebar, result cards, URL-param state (`nuqs`), pagination
- [ ] Driver detail page: profile, experience timeline, certification badges (uploaded / on request / verified / expired), truck info
- [ ] Shortlists: schema + procedures + UI (save driver, list shortlists)
- [ ] Saved searches: schema + procedures + UI
- [ ] i18n strings for all new dashboard surfaces

## Phase 3 — AI intake (voice → profile)

- [ ] `aiIntakeSession` schema + zod extraction schema (profile, experience[], certifications[], truck?)
- [ ] `ai.intake.transcribe` procedure (audio from S3 → Whisper)
- [ ] `ai.intake.extract` procedure (transcript → structured draft via AI SDK structured output; prompts in `packages/ai/lib/prompts.ts`)
- [ ] `ai.intake.apply` procedure (transactional write after driver approval)
- [ ] Cert auto-detect → per-cert prompt: **Upload now** / **Provide upon request**
- [ ] Web test harness route (record/upload audio, review draft, edit, apply)
- [ ] Text-interview fallback reusing existing `stream-message` chat
- [ ] Resume upload + parse-to-prefill (stretch)

## Phase 4 — Contact & messaging

- [ ] `contactRequest` schema + procedures (send, accept, decline) with rate limiting
- [ ] `conversation` + `message` schema + procedures (created on accepted request)
- [ ] Dashboard inbox + conversation UI
- [ ] Document request flow: company asks, driver approves, signed-URL access + `documentAccessLog`
- [ ] Extend notification types: `contact_request`, `new_message`, `certification_expiring`; email templates in `packages/mail/emails`

## Phase 5 — Jobs & matching

- [ ] `jobPosting` schema + CRUD procedures + dashboard UI
- [ ] `jobMatch` computation (cert/equipment/region match) + `job_match` notifications
- [ ] Driver-facing job feed endpoint (consumed by mobile app)
- [ ] Saved-search "new match" alert emails

## Phase 6 — Billing & admin

- [ ] Define plans (Starter / Growth / Fleet) in `packages/payments/config.ts`; wire provider (Stripe default)
- [ ] Gate contact requests + seats by plan in procedures
- [ ] Admin: carrier verification queue (verified badge), driver moderation
- [ ] Cert-expiry reminder job + `certification_expiring` notifications
- [ ] Marketing site: two-audience landing, pricing page

## Phase 7 — Mobile driver app (base: `vendor/moneyra-template`)

- [x] Vendor `moneyra-template` into this monorepo at `vendor/moneyra-template` (unmodified copy from `robot9s/driver-platform-expo-app` @ 5198445; outside workspace globs until adopted)
- [x] Archive https://nativelaunch.dev/docs into the repo (`docs/nativelaunch/`, 40 pages + `crawl.mjs` to regenerate; crawled 2026-07-07, no pages login-gated)
- [x] Audit `moneyra-template` (premium base app): map its modules, decide keep/gut list (see `docs/moneyra-audit.md` — no Supabase/push exists; template is offline-first WatermelonDB, auth is biometric-lock only)
- [x] Verify NativeLaunch Pro license permits use in this product/repo (owner confirmed 2026-07-08: license purchased — repo access is gated on purchase — and no attribution required)
- [x] Adopt template into pnpm workspace as `apps/mobile` (keep `vendor/` copy pristine) — pnpm install + tsc + Metro bundle (`expo export`) all green; added `react-native-css-interop` as direct dep for pnpm isolated linking; mobile keeps its own eslint (excluded from root oxlint). On-device build still to be done
- [ ] Gut finance domain per `docs/moneyra-audit.md` §7 (screens/entities/widgets, WatermelonDB, iCloud backup, RevenueCat); clean `app.config.js`/`babel.config.js`/deps; replace committed Firebase/Sentry/iCloud identifiers
- [x] Wire Better Auth: `expo()` plugin + `moneyra://` scheme in trustedOrigins (`packages/auth/auth.ts`); mobile `authClient` (`src/shared/api/auth-client.ts`, SecureStore-backed); `/login` screen (email+password); session guard in AppLayout redirects to `/login`; sign-out card in Settings. Still to do: signup + magic-link screens; onboarding gate kept as-is
- [x] Wire oRPC client against `/api/rpc` typed by `ApiRouterClient` (`src/shared/api/orpc.ts`, cookie from `authClient.getCookie()`); Home screen queries `drivers.getMyProfile`. `EXPO_PUBLIC_API_URL` env added (defaults to http://localhost:3000). Compile+bundle verified; on-device runtime smoke-test still to do
- [ ] Rebuild tab shell (Home / Jobs / Messages / Profile) on the kept `TabLayout`; prune i18n to en+fr and regenerate keys
- [ ] Add a test runner (jest-expo or vitest) + adapt template CI workflows and EAS project (owner/projectId in `env.js`) to the monorepo
- [ ] Driver onboarding: signup, voice intake (record → transcribe → review → apply)
- [ ] Profile management: certifications (upload / provide-on-request), documents, truck listing
- [ ] Job feed + contact requests + messaging
- [ ] Expo push notifications (token registration endpoint + fan-out) — net-new work, the template ships no push plumbing

## Parked / future

- [ ] Dispatch workflow (assign driver to job after cert verification)
- [ ] Dedicated search engine (Typesense/Meilisearch) or pgvector semantic matching
- [ ] Company-side AI: job description → required certs suggestion; match explanations
- [ ] Driver web profile editor (if mobile-only proves limiting)
