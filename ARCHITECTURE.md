# Driver Platform — Architecture & Product Plan

> A Canadian platform connecting Class 1 (AZ) truck drivers with carriers and
> dispatch teams. Drivers build rich, verified profiles (with AI-assisted voice
> intake); companies search, filter, and contact the right driver for the job.

**Working name:** _TBD_ (referred to as "the platform" below — rename in
`apps/*/config` once decided).

---

## 1. Product Overview

### Personas

| Persona | Surface | Account shape |
| --- | --- | --- |
| **Driver** (company driver or owner-operator) | Mobile app (later; separate repo) + API | Individual `user`, no organization |
| **Company / Dispatcher / Recruiter** | SaaS web dashboard (`apps/saas`) | `organization` with members (Better Auth orgs) |
| **Platform admin** | Existing admin module in `apps/saas` | `user` with admin role |

### Core value loops

1. **Driver side:** register → speak (or type) experience to an AI agent →
   AI generates a structured profile + detects certifications → driver
   uploads certs/resume or marks "provide upon request" → owner-operators
   list their truck → get notified about matching job opportunities.
2. **Company side:** register org → subscribe → search drivers by
   certification / experience / equipment / region → view profiles →
   shortlist & contact → (future) dispatch after verifying certifications.

---

## 2. What supastarter already gives us (reuse, don't rebuild)

| Need | Existing capability | Where |
| --- | --- | --- |
| Auth (email/pw, magic link, passkeys, 2FA) | Better Auth | `packages/auth` |
| Company accounts, seats, invitations | Better Auth organizations | `packages/auth`, `apps/saas/modules/organizations` |
| API layer consumable by web **and** mobile | oRPC over Hono (`/api`) | `packages/api` |
| DB | Drizzle + Postgres | `packages/database` (schema: `drizzle/schema/postgres.ts`) |
| AI | Vercel AI SDK + Anthropic/OpenAI, streaming chat procedure | `packages/ai`, `packages/api/modules/ai` |
| File uploads | S3 presigned URLs (see avatar upload pattern) | `packages/storage`, `packages/api/modules/users/procedures/create-avatar-upload-url.ts` |
| Billing | Stripe/Polar/LemonSqueezy/Creem/Dodo | `packages/payments` |
| Email | Resend/Postmark/etc. + react-email templates | `packages/mail` |
| In-app + email notifications | Notification tables & module | `packages/database`, `packages/api/modules/notifications` |
| Marketing site, blog, legal | | `apps/marketing` |
| Admin panel | | `apps/saas/modules/admin` |

Key decision that falls out of this: **one backend for everything.** The
mobile driver app is just another client of the same oRPC/Hono API and the
same Better Auth instance. No separate driver backend.

---

## 3. Domain model (new Drizzle tables)

All new tables live in `packages/database/drizzle/schema/` alongside the
existing ones, with query helpers in `packages/database/drizzle/queries/`.

### User typing

- Add `userType` (`"driver" | "company_member"`) as a Better Auth additional
  field on `user`. Drivers never belong to an organization; company users do.

### Driver domain

- **`driverProfile`** — 1:1 with `user`. Fields: headline, bio,
  `aiSummary`, years of experience, licence class + issuing province,
  home region (province + city), radius / regions willing to run,
  haul preferences (long haul, regional, local, cross-border US),
  employment preference (company driver / owner-operator / lease),
  availability status, hourly-vs-mileage preference, profile completeness
  score, `visibility` (active / hidden), verification status.
- **`driverExperience`** — work history entries: employer, role, start/end,
  equipment operated, freight types, cross-border %, description
  (free text + AI-extracted tags).
- **`driverCertification`** — the heart of matching. Fields: `type`
  (taxonomy below), issuing authority/province, number (encrypted/optional),
  issue & expiry dates, **`evidenceStatus`**:
  `"uploaded" | "provide_upon_request" | "verified" | "expired"`,
  storage key of the uploaded file (nullable).
- **`driverDocument`** — resume, driver's abstract, CVOR abstract, criminal
  record check, references, etc.: `type`, storage key, label, uploaded at.
- **`truck`** — owner-operator equipment: make, model, year, truck type,
  trailer type(s) (dry van, reefer, flatbed, step deck, tanker, Super B,
  lowboy, dump, car hauler…), photos (storage keys), safety/inspection date.

### Certification taxonomy (Canada, Class 1 focused)

Union-literal `certificationType` shared from `packages/api/.../types.ts`:
`class1_licence` (AZ in ON), `air_brake_z`, `melt_completion`, `tdg`
(dangerous goods), `whmis`, `lcv_permit` (long combination vehicle),
`tanker_experience`, `fast_card` (cross-border), `passport`,
`twic`, `forklift`, `crane`, `first_aid`, `other` (with label).
Documents like abstracts live in `driverDocument`, not here.

### Company domain

- **`companyProfile`** — 1:1 with `organization`: legal name, DOT/MC number,
  NSC/CVOR number, fleet size, freight focus, regions served, description,
  logo, verification status (admin-verified carrier badge).
- **`driverShortlist`** / **`shortlistEntry`** — org-scoped saved drivers.
- **`savedSearch`** — org-scoped persisted filter sets (+ optional "alert me
  on new matches" flag, powers future digest emails).
- **`contactRequest`** — company → driver first-touch (required before
  messaging; lets drivers accept/decline and lets us meter billing).

### Communication

- **`conversation`** + **`message`** — driver ↔ organization threads,
  created when a `contactRequest` is accepted. Attachments via storage keys.
- Extend `notificationTypeEnum` with: `contact_request`, `new_message`,
  `job_match`, `certification_expiring`, `profile_tip`.

### Jobs (Phase 5)

- **`jobPosting`** — org-scoped: title, description, haul type, equipment,
  required certifications (array of taxonomy values), region, pay range,
  owner-operator vs company-driver, status.
- **`jobMatch`** — computed matches driver×posting used to fan out
  "job opportunity" notifications.

### AI intake

- **`aiIntakeSession`** — per driver: transcript chunks, extraction result
  (JSON), detected certifications, status
  (`recording | extracting | review | applied`). Keeps the raw material so
  drivers can re-run/append later and we can improve prompts.

---

## 4. AI features architecture

All AI logic lives in `packages/ai` (prompts, zod schemas) and is exposed via
oRPC procedures in `packages/api/modules/ai` — so web and mobile share it.

### Voice → profile pipeline

1. **Capture:** client records audio (mobile app later; a web test harness in
   the dashboard first) and uploads chunks to S3 via presigned URL.
2. **Transcribe:** `ai.intake.transcribe` procedure calls a speech-to-text
   API (OpenAI Whisper via the already-present `openai` dep).
3. **Extract:** `ai.intake.extract` runs the transcript through Claude with
   AI SDK **structured output** (zod schema = driver profile + experience
   entries + detected certifications + detected truck). Prompts live in
   `packages/ai/lib/prompts.ts`.
4. **Review:** client shows an editable draft ("Here's what I heard…").
   Detected certifications each prompt: **Upload now** or
   **Provide upon request**.
5. **Apply:** `ai.intake.apply` writes profile/experience/cert rows in one
   transaction. Nothing is persisted to the profile without driver approval.
6. **Conversational fallback:** the existing `stream-message` chat procedure
   is reused for a text-based interview mode (same extraction at the end).

### Other AI touchpoints (later)

- Resume parsing (uploaded PDF → prefill profile).
- Job-description → required-certifications suggestion for companies.
- Match explanations ("why this driver fits").

---

## 5. Search & matching

- **v1:** Postgres — indexed filter columns (province, cert types via join,
  truck type, years experience, employment preference, availability) +
  `tsvector` full-text over bio/experience. Exposed as
  `drivers.search` procedure with a zod filter schema; dashboard UI keeps
  filters in URL params (`nuqs`).
- **Later:** move to dedicated search (Typesense/Meilisearch) or pgvector
  semantic search over AI summaries, only if Postgres stops being enough.

---

## 6. Apps & surfaces

### `apps/saas` — company dashboard (this repo, main build target)

New feature modules (mirroring existing module conventions + path aliases):

- `modules/drivers` — search page (filters sidebar + result cards),
  driver detail page (profile, experience timeline, cert list with
  status badges, truck, "request documents" action), shortlists.
- `modules/messaging` — inbox, conversation view.
- `modules/jobs` — job posting CRUD (Phase 5).
- `modules/company` — company profile editing (extends org settings).
- Driver-facing web routes (minimal, Phase 3+): AI intake test harness and a
  read-only public driver profile page (for share links) — the full driver UX
  ships in the mobile app.
- Admin: carrier verification queue, driver moderation, cert-expiry overview.

### `apps/marketing`

Two-audience landing ("For drivers" / "For carriers"), pricing, blog. Copy
skeleton only until product stabilizes.

### Mobile driver app (separate repo, later phase)

- Base: `nativelaunch/moneyra-template` (private). **Recommendation: clone
  into a fresh private repo under your account** (not a GitHub fork — forks
  of private templates stay chained to upstream and complicate divergence).
  When we start this track, the repo must be added to the session
  (`add_repo`) so I can access it through your account.
- Talks to the same `/api` (oRPC) + Better Auth endpoints; Expo push tokens
  stored per user for job-match/message notifications.

---

## 7. Billing model (companies pay, drivers ride free)

Use existing `packages/payments` (recommend **Stripe** unless you prefer
another supported provider). Suggested gating, enforced in procedures:

- **Starter:** N contact requests/month, 1 seat.
- **Growth:** more contacts, seats, saved-search alerts.
- **Fleet/Enterprise:** unlimited contacts, priority placement, API access.

Driver accounts never hit a paywall.

---

## 8. Security & compliance notes

- PIPEDA applies: cert numbers and abstracts are sensitive — store documents
  in S3 with short-lived signed URLs, never public; only reveal documents to
  a company after the driver accepts the contact/document request.
- Drivers control visibility (`hidden` profiles excluded from search).
- Audit trail on document access (who viewed what, when) — cheap to add via
  a `documentAccessLog` table when document sharing lands.
- Rate-limit contact requests to prevent scraping/spam.

---

## 9. Build phases

See `TODO.md` for the live task tracker. Summary:

- **Phase 0 — Foundation:** branding/config, env, DB running, `userType`,
  seed data.
- **Phase 1 — Driver domain:** schema + queries + CRUD procedures for
  profile/experience/certifications/documents/truck; S3 uploads.
- **Phase 2 — Company dashboard:** company profile, driver search + filters,
  driver detail, shortlists, saved searches.
- **Phase 3 — AI intake:** transcription, structured extraction, review &
  apply flow, cert auto-detection, web test harness.
- **Phase 4 — Contact & messaging:** contact requests, conversations,
  notifications (in-app + email).
- **Phase 5 — Jobs & matching:** postings, match computation, driver alerts.
- **Phase 6 — Billing & admin:** plans + gating, carrier verification,
  moderation, cert-expiry reminders.
- **Phase 7 — Mobile driver app:** separate repo track (clone template,
  wire auth + API, intake UX, push notifications).

### Open decisions (non-blocking, defaults in parentheses)

1. Platform name & domain (placeholder until decided).
2. Payment provider (Stripe).
3. Speech-to-text vendor (OpenAI Whisper — dep already present).
4. Do drivers get a lightweight web profile editor too, or mobile-only?
   (Plan assumes a minimal web harness first regardless, since it also
   de-risks the mobile build.)
