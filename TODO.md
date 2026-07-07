# TODO — Driver Platform

> Live task tracker. See `ARCHITECTURE.md` for the full plan and rationale.
> Mark items `[x]` as they land; add discovered work under the right phase.

## Phase 0 — Foundation

- [ ] Decide platform name; update `apps/saas/config` + `apps/marketing/config` branding
- [ ] Environment setup: `.env.local` (DB, S3, mail, AI keys), `docker-compose` Postgres running, migrations applied
- [ ] Add `userType` (`driver` | `company_member`) additional field to Better Auth user + signup flows
- [ ] Route company signups through existing org onboarding; driver signups skip org creation
- [ ] Seed script: sample drivers, certifications, companies for local dev

## Phase 1 — Driver domain (schema + API)

- [ ] Drizzle schema: `driverProfile`, `driverExperience`, `driverCertification`, `driverDocument`, `truck`
- [ ] Certification taxonomy union type + zod schemas in `packages/api/modules/drivers/types.ts`
- [ ] Query helpers in `packages/database/drizzle/queries/`
- [ ] oRPC module `drivers`: profile get/upsert, experience CRUD, certification CRUD (with `evidenceStatus`), document CRUD, truck CRUD
- [ ] S3 presigned upload procedures for certs/documents/truck photos (follow avatar-upload pattern)
- [ ] Migrations generated + applied

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

## Phase 7 — Mobile driver app (separate repo)

- [ ] Add `nativelaunch/moneyra-template` to session (`add_repo`); clone into fresh private repo under owner account
- [ ] Strip template domain code; wire Better Auth + oRPC client against `/api`
- [ ] Driver onboarding: signup, voice intake (record → transcribe → review → apply)
- [ ] Profile management: certifications (upload / provide-on-request), documents, truck listing
- [ ] Job feed + contact requests + messaging
- [ ] Expo push notifications (token registration endpoint + fan-out)

## Parked / future

- [ ] Dispatch workflow (assign driver to job after cert verification)
- [ ] Dedicated search engine (Typesense/Meilisearch) or pgvector semantic matching
- [ ] Company-side AI: job description → required certs suggestion; match explanations
- [ ] Driver web profile editor (if mobile-only proves limiting)
