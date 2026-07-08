# Moneyra Template Audit

Audit of the vendored NativeLaunch Pro "Moneyra" Expo template at `vendor/moneyra-template`, evaluated as the base for the driver mobile app (Phase 7). Written 2026-07-07 against the unmodified vendor copy (v4.0.0 per `vendor/moneyra-template/package.json` / `CHANGELOG.md`).

**Headline finding:** the template has **no backend at all**. It is an offline-first, local-only personal-finance app built on WatermelonDB (local SQLite). There is no Supabase, no HTTP/fetch layer, no server auth, and no push-notification plumbing anywhere in the codebase (`grep` for `supabase|expo-notifications|push|Notification` returns zero matches). "Auth" in this template is a biometric app-lock, not accounts. That means the Phase 7 work is not "swap one backend for another" — it is "add a network/auth layer that does not exist yet, and delete the local finance domain."

---

## 1. Snapshot

- **What it is:** NativeLaunch Pro "Moneyra" — a production-grade personal-finance / expense-tracker template (`vendor/moneyra-template/README.md`). Docs at https://nativelaunch.dev/docs (TODO already tracks archiving them into the repo).
- **Architecture:** Feature-Sliced Design (FSD). `app/` route files are one-line re-exports; all real code lives under `src/` in `application` / `screens` / `widgets` / `features` / `entities` / `shared` layers, with path aliases `@app`, `@screens`, `@widgets`, `@features`, `@entities`, `@shared`, `@assets` (`vendor/moneyra-template/tsconfig.json`).
- **Package manager:** npm (`package-lock.json`; the template is intentionally outside the pnpm workspace globs — `pnpm-workspace.yaml` only includes `config`, `apps/*`, `packages/*`, `tooling/*`).
- **Node:** `.nvmrc` = 22; `engines.node >= 22.13.0`.

Key versions (from `vendor/moneyra-template/package.json`):

| Area | Package | Version |
|---|---|---|
| Framework | `expo` | `^56.0.14` (SDK 56, `newArchEnabled: true` in `app.config.js`) |
| | `react-native` | `0.85.3` |
| | `react` / `react-dom` | `19.2.3` |
| | `expo-router` | `~56.2.13` (typed routes enabled) |
| Language | `typescript` | `~6.0.3` (strict; `ignoreDeprecations: "6.0"`) |
| Styling | `nativewind` | `^4.2.6` + `tailwindcss ~3.4.18` |
| UI kit | `@rn-primitives/*` | `^1.5.2` (shadcn-style, react-native-reusables; `components.json`) |
| Local data | `@nozbe/watermelondb` | `^0.28.0` (SQLite, JSI) |
| KV storage | `react-native-mmkv` | `~4.3.1` |
| Client state | `zustand` | `~5.0.12` (persisted via MMKV) |
| Server-state | `@tanstack/react-query` | `^5.99.2` (+ `persist-client`, `query-async-storage-persister`) |
| Forms | `react-hook-form ~7.81.0` + `@hookform/resolvers` + `zod ~4.4.3` | |
| Payments | `react-native-purchases` (RevenueCat) | `^9.6.6` |
| Crash/APM | `@sentry/react-native` | `~7.11.0` (metro + expo plugin) |
| Analytics | `@react-native-firebase/app` + `analytics` | `^23.5.0` |
| i18n | `i18next ^25.6.3` / `react-i18next ^16.3.5` + `i18next-scanner` | 6 locales |
| Animation | `react-native-reanimated 4.3.1` + `react-native-worklets 0.8.3` | |
| Charts | `@shopify/react-native-skia 2.6.9` (pinned; in `expo.install.exclude`) | |
| Sheets/lists | `@gorhom/bottom-sheet ~5.2.10`, `@legendapp/list` | |
| Backup | `react-native-cloud-storage ^3.0.0` (iCloud container in `app.config.js`) | |
| App lock | `expo-local-authentication` | `~56.0.4` |

Notably **absent**: any HTTP client, Supabase, `expo-notifications`, `expo-secure-store`, and any test runner (scripts are only `lint` and `test:ts` = `tsc --noEmit`).

Monorepo counterparts this app must integrate with: `better-auth 1.6.22` and `@orpc/* 1.14.6` (pinned in the `pnpm-workspace.yaml` catalog), server auth config in `packages/auth/auth.ts`, oRPC router in `packages/api/orpc/router.ts`, Hono app mounted at `/api` in `packages/api/index.ts`.

## 2. Navigation structure

Expo-router tree as found under `vendor/moneyra-template/app/` (every route file is a re-export into `src/`):

```text
app/
	_layout.tsx                     → src/application/layouts/RootLayout.tsx (providers + root Stack)
	index.tsx                       → Redirect: onboarded ? /(app)/(tabs) : /welcome (MMKV flag)
	welcome.tsx                     → src/screens/welcome (onboarding pager)
	select-currency.tsx             → src/screens/select-currency (onboarding step 2)
	+not-found.tsx                  → src/screens/not-found
	(app)/                          → src/application/layouts/AppLayout.tsx (Stack; RevenueCat init,
	│                                 delayed push to /paywall for non-pro users, auto-backup init)
	│	(tabs)/                     → src/application/layouts/TabLayout.tsx (Tabs + custom TabBottom bar,
	│	│                             center "+" button routes to /transaction/create)
	│	│	index.tsx               → Home (transactions overview)
	│	│	budgets.tsx
	│	│	statistics.tsx
	│	│	settings.tsx
	│	accounts/  index, create, [id]
	│	budget/    create, [id]/index, [id]/edit
	│	categories/ index, create, expense/[id], income/[id]
	│	currencies/ index, add
	│	data/      index, backup, export, import
	│	statistics/[id]
	│	transaction/ create, [id]
	│	appearance.tsx  faq.tsx  language.tsx  paywall.tsx
	(static)/                       → src/application/layouts/AuxiliaryLayout.tsx (modal presentation)
		privacy-policy.tsx
		terms-of-service.tsx
```

Root `Stack` in `src/application/layouts/RootLayout.tsx` declares `(app)`, `(static)` (modal), `welcome`, `select-currency`, `+not-found`. Provider stack (outer→inner): `PersistQueryClientProvider` → `SafeAreaProvider` → `KeyboardProvider` → `ThemeProvider` → `CustomPaletteWrapper` → `LanguageProvider` → `SheetProvider` → Stack + `ToastRoot` + `PortalHost`. Sentry wraps the root component export.

**Route guarding today:** there are no session guards. Two mechanisms exist:
- Onboarding gate: `app/index.tsx` reads `STORAGE_CONSTANT_IS_USER_ONBOARDED` from MMKV (`src/shared/storage/contstant-storage`).
- App lock: `<AuthLocal/>` (biometric overlay, `src/entities/auth/ui/auth-local.tsx`) is rendered *on top of* the Stack when `useLocalAuth` (`src/entities/auth/libs/use-local-auth.tsx`) decides the app was backgrounded > 30s and the user enabled the lock in settings.

## 3. Module & screen inventory

Verdicts relative to the driver-app plan: **KEEP** (use nearly as-is), **REWIRE** (keep shell, change internals/data source), **GUT** (delete).

| Feature area | Location(s) | Verdict | Notes |
|---|---|---|---|
| Root shell / providers | `src/application/layouts/RootLayout.tsx`, `app/_layout.tsx` | REWIRE | Keep provider stack, splash handling, theme, query persistence; add Better Auth session provider; drop AuthLocal from the critical path (or keep as optional app-lock). |
| App stack layout | `src/application/layouts/AppLayout.tsx`, `app/(app)/_layout.tsx` | REWIRE | Keep the Stack + BackButton chrome; delete RevenueCat init, paywall redirect, `initializeAutoBackup()`. Add session guard here. |
| Tab layout | `src/application/layouts/TabLayout.tsx` + `ui/TabBottom` | REWIRE | Keep custom tab bar; rename tabs to driver concepts (Home/Jobs/Messages/Profile), repoint the center "+" action. |
| Static/legal layout | `src/application/layouts/AuxiliaryLayout.tsx`, `app/(static)/*` | KEEP | Replace legal copy. |
| Onboarding welcome | `src/screens/welcome`, `app/welcome.tsx`, `assets/images/onboarding/*` | REWIRE | Keep pager mechanics; replace imagery/copy; hand off to signup instead of select-currency. |
| Currency onboarding | `src/screens/select-currency`, `app/select-currency.tsx` | GUT | Finance-specific. |
| Home / transactions | `src/screens/transactions`, `app/(app)/(tabs)/index.tsx`, `src/widgets/transaction*`, `src/entities/transaction` | GUT | Screen shell can inspire the job feed, but data layer is WatermelonDB. |
| Accounts | `src/screens/accounts`, `account-overview`, `create-account`, `app/(app)/accounts/*`, `src/entities/account`, `src/features/create-account`, `delete-account`, `src/widgets/account-picker` | GUT | |
| Budgets | `src/screens/budgets`, `budget-overview`, `create-budget`, `edit-budget`, `app/(app)/budget*`, `(tabs)/budgets.tsx`, `src/entities/budget`, `src/widgets/budget` | GUT | |
| Categories | `src/screens/categories`, `create-category`, `expense-category-overview`, `income-category-overview`, `app/(app)/categories/*`, `src/entities/category`, `src/features/create-category`, `delete-category`, `src/widgets/category-picker` | GUT | |
| Currencies | `src/screens/currencies`, `add-currency`, `app/(app)/currencies/*`, `src/entities/currency`, `src/features/delete-currency`, `search-currencies`, `src/widgets/currency-list`, `currency-selector`, `src/shared/config/currencies` | GUT | |
| Statistics | `src/screens/statistics`, `statistics-overview`, `app/(app)/statistics/[id].tsx`, `(tabs)/statistics.tsx`, `src/features/statistics`, `src/widgets/month-selector`, `time-range-control` | GUT | Skia chart components may be worth salvaging individually. |
| Data / backup / import-export | `src/screens/data`, `backup`, `export`, `import`, `app/(app)/data/*`, `src/shared/backup` | GUT | iCloud/CSV/JSON backup of the local DB — meaningless once server-backed. |
| Local database | `src/shared/database/*` (schema, migrations, 6 models, seed) | GUT | Also remove the WatermelonDB decorator `overrides` block in `babel.config.js` and the `simdjson` extraPod in `app.config.js`. |
| Paywall / subscription | `src/screens/paywall`, `app/(app)/paywall.tsx`, `src/entities/subscription` (RevenueCat) | GUT | Driver app has no IAP; also drop `com.android.vending.BILLING` permission in `app.config.js`. |
| Local biometric lock | `src/entities/auth` | KEEP | Useful optional feature; it is *not* account auth. |
| Settings shell | `src/screens/settings`, `app/(app)/(tabs)/settings.tsx`, `src/widgets/settings-card`, `app-version` | REWIRE | Keep card UI; swap finance rows for account/profile/logout rows. |
| Appearance / language / FAQ | `src/screens/appearance`, `language`, `faq` + routes | KEEP | Generic. |
| Not-found | `src/screens/not-found`, `app/+not-found.tsx` | KEEP | |
| UI kit | `src/shared/ui/*` (button, input, select, tabs, avatar, …), `src/shared/ui-primitives/*` (DatePicker, Sheet, ConfirmationDialog, NumericPad, FinalFormKit, …), `src/shared/sheet-provider`, `src/shared/toast` | KEEP | The core value of the template. `CategoryIconPicker`/`WalletIconPicker`/`ColorPicker` are finance-flavoured — cut or keep case-by-case. |
| i18n | `src/shared/i18n/*`, `src/shared/assets/locales/{en,ru,es,pt,de,fr}.json`, `i18next-scanner.config.js` | KEEP | Keys are finance-heavy; regenerate. For CA market, en + fr matter. |
| State/storage utils | `src/shared/storage/*` (MMKV instances: constant/global/query/zustand), `src/shared/stores/user-settings` | KEEP | Query persister + NetInfo online manager already wired in RootLayout. |
| Theme/palette | `src/shared/config/colors`, `src/shared/lib/palette`, `theme`, `src/application/providers/CustomPaletteWrapper.tsx` | KEEP | |
| Analytics | `src/shared/config/firebase`, `google-services.json`, `GoogleService-Info.plist` | REWIRE or GUT | Config files are the template author's — must be replaced (or Firebase dropped entirely; analytics calls are scattered through entity hooks that get gutted anyway). |
| Crash reporting | `src/shared/config/sentry`, `@sentry/react-native/expo` plugin in `app.config.js`, `metro.config.js` | KEEP | Re-point DSN/org/project (currently hardcoded `money-plus`/`moneyra-app` in `app.config.js`). |
| Env validation | `env.js`, `.env.example`, `app.config.js` | KEEP | zod-validated client/build-time env injected into `expo.extra` (obytes pattern). |
| CI / release | `.github/workflows/{checks,eas-build-and-submit,release-app}.yaml`, `.github/actions/*`, `eas.json`, `release-please-config.json` | KEEP | Adapt to monorepo paths; secrets change. |
| Dev tooling | `ReactotronConfig.js`, `expo-dev-client`, eslint/prettier configs | KEEP | |

## 4. Auth approach

**Today:** there are no user accounts anywhere in the template.
- `src/entities/auth` is a *device* lock: `expo-local-authentication` (Face ID/biometrics), rendered as a full-screen overlay (`AuthLocal`) above the navigator when the app returns from background after 30s (`BIO_AUTH_EXPIRATION_TIME` in `src/entities/auth/libs/use-local-auth.tsx`). The toggle lives in the zustand `user-settings` store; the background timestamp in MMKV `globalStorage`.
- "Session" state is just the MMKV boolean `STORAGE_CONSTANT_IS_USER_ONBOARDED` checked in `app/index.tsx`.
- There are no login/signup screens to rewire — they must be **built**, though `src/shared/ui-primitives/FinalFormKit` + `react-hook-form` + zod give a ready form toolkit.

**Target:** Better Auth against the existing server config in `packages/auth/auth.ts` (email/password with optional verification, magic link, Google/GitHub social, plus `admin`/`organization`/`twoFactor`/`passkey` plugins; user `additionalFields` include `onboardingComplete` and `userType`, which the driver app should set). The auth handler is already mounted at `/api/auth/**` by the Hono app in `packages/api/index.ts` (with a 20 req/min rate limit on that path).

Concrete rewiring steps:
1. **Server** — add the Expo plugin to `packages/auth/auth.ts`:

	```ts
	import { expo } from "@better-auth/expo";
	// ...
	plugins: [expo(), admin(), passkey(), magicLink({...}), organization({...}), ...]
	```

	and add the app scheme (e.g. `driverapp://`) to the trusted origins (`getTrustedOrigins()` in `packages/utils` feeds both `trustedOrigins` here and the CORS allow-list in `packages/api/index.ts`).
2. **Mobile client** — create an auth client mirroring `packages/auth/client.ts` but with the Expo client plugin:

	```ts
	import { createAuthClient } from "better-auth/react";
	import { expoClient } from "@better-auth/expo/client";
	import * as SecureStore from "expo-secure-store";

	export const authClient = createAuthClient({
		baseURL: process.env.EXPO_PUBLIC_API_URL, // server root; Better Auth lives under /api/auth
		plugins: [
			expoClient({ scheme: "driverapp", storagePrefix: "driverapp", storage: SecureStore }),
			inferAdditionalFields<typeof auth>(),
			magicLinkClient(),
		],
	});
	```

	This requires adding `@better-auth/expo` and `expo-secure-store` to the app (neither is present today). The Expo plugin stores the session cookie in SecureStore and exposes `authClient.getCookie()` for authenticated `fetch`es.
3. **Route guarding** — add an `(auth)` route group (login, signup, forgot-password) and gate `(app)`: replace the MMKV check in `app/index.tsx` with `authClient.useSession()`; redirect unauthenticated users to `(auth)`. Keep `AuthLocal` as an optional extra lock on top.
4. **Version note** — pin `better-auth` in the app to the catalog version `1.6.22` so client/server plugin type inference (`inferAdditionalFields<typeof auth>`) matches.

## 5. API client structure

**Today: there is none.** Data access is entirely local:
- Per-entity repositories over WatermelonDB: `src/entities/{account,budget,category,currency,transaction}/model/repository.watermelon.ts`.
- Hooks in `model/hooks.ts` wrap repos with `useState`/`useEffect` and WatermelonDB observation, plus a tiny `eventBus` (`src/shared/lib/eventBus`) for cross-entity refresh, and fire Firebase Analytics events inline.
- TanStack Query **is** installed and fully wired for server-state (`PersistQueryClientProvider` with an MMKV-backed persister from `src/shared/storage/query-storage`, `onlineManager` bound to NetInfo, `networkMode: 'offlineFirst'` defaults in `src/application/libs/queryClient.ts`) — but no domain code uses it. That infrastructure is exactly what the oRPC client will slot into.

**Target:** a typed oRPC client against the existing Hono mount. The monorepo already demonstrates the pattern in the web app:
- `apps/saas/modules/shared/lib/orpc-client.ts` — `createORPCClient` + `RPCLink` (from `@orpc/client`) pointed at `/api/rpc`, typed as `ApiRouterClient`.
- `apps/saas/modules/shared/lib/orpc-query-utils.ts` — `createTanstackQueryUtils` from `@orpc/tanstack-query`.
- The router type is exported from `packages/api/orpc/router.ts`: `export type ApiRouterClient = RouterClient<typeof router>` with namespaces `admin`, `organizations`, `users`, `drivers`, `payments`, `ai`, `notifications`.

Mobile equivalent (new file, e.g. `src/shared/api/orpc.ts` in the app):

```ts
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { ApiRouterClient } from "@repo/api/orpc/router";
import { authClient } from "../auth/client";

const link = new RPCLink({
	url: `${process.env.EXPO_PUBLIC_API_URL}/api/rpc`,
	headers: () => ({ cookie: authClient.getCookie() }), // Better Auth Expo session cookie
});

export const apiClient: ApiRouterClient = createORPCClient(link);
```

Driver-facing procedures already exist in `packages/api/modules/drivers/procedures/`: `get-my-profile`, `upsert-profile`, `save-certification`, `delete-certification`, `save-document`, `delete-document`, `create-document-upload-url`, `save-experience`, `delete-experience`, `save-truck`, `delete-truck`.

Prerequisites / decisions:
- Add `EXPO_PUBLIC_API_URL` to the client schema in `env.js` (and `.env.example`).
- Importing `@repo/api` types requires the app to join the pnpm workspace (it currently sits outside the globs with its own npm `package-lock.json`). Either adopt it into `apps/*` (preferred; needs metro `watchFolders`/monorepo config) or keep it standalone and consume types via a relative `tsconfig` path — a decision to make before wiring.
- CORS in `packages/api/index.ts` is origin-allow-listed; native requests typically send no `Origin`, but the Better Auth Expo plugin's trusted-origins (app scheme) must still be configured (see §4).

## 6. Infra & tooling worth keeping

- **Env validation:** `env.js` — zod schemas split into `client` (embedded via `expo.extra`, `EXPO_PUBLIC_*`) and `buildTime`; `withEnvSuffix` derives per-environment bundle ids (`com.moneyra.app.development` etc.) from `APP_ENV ∈ {development, preview, production}`. Keep the pattern; swap identity constants (`BASE_BUNDLE_ID`, `APP_NAME`, `SCHEME`, `SLUG`) and add `EXPO_PUBLIC_API_URL`.
- **EAS:** `eas.json` — three profiles: `development` (dev client, internal APK), `preview` (internal APK), `production` (remote credentials, `autoIncrement`, pinned Xcode image). `cli.appVersionSource: remote`.
- **CI:** `.github/workflows/checks.yaml` (ESLint + `tsc --noEmit` on push to main), `.github/workflows/eas-build-and-submit.yaml` (manual dispatch; `eas build --local` on macos-15/ubuntu or self-hosted, optional `eas submit` to TestFlight/Play), `.github/workflows/release-app.yaml` + `release-please-config.json` for release automation. Composite actions in `.github/actions/{setup-expo,setup-node-environment}`. These need porting into the monorepo's CI story rather than running as-is.
- **i18n:** full i18next setup (`src/shared/i18n/i18n.ts` with `expo-localization` detector + persisted override, `LanguageProvider`, typed `useTranslation`) and `npm run gen:i18n` via `i18next-scanner.config.js`. Locales: en, ru, es, pt, de, fr — trim to en/fr for the Canadian market.
- **Styling toolchain:** NativeWind 4 via `metro.config.js` (`withNativeWind` wrapped around `getSentryExpoConfig`) + `babel.config.js` preset; `components.json` allows adding more react-native-reusables components by CLI.
- **Dev tooling:** Reactotron (`ReactotronConfig.js`, dev-only require in RootLayout), `expo-dev-client`, eslint 9 flat config (`eslint.config.mjs`), prettier.
- **Testing:** effectively none (no jest/vitest/RNTL; `test:ts` is just `tsc`). CI type-check + lint is the only safety net — a gap to close, not an asset.

## 7. Gut list

Delete when work starts (paths relative to the adopted app root):

- `app/(app)/(tabs)/budgets.tsx`, `app/(app)/(tabs)/statistics.tsx`
- `app/(app)/accounts/`, `app/(app)/budget/`, `app/(app)/categories/`, `app/(app)/currencies/`, `app/(app)/data/`, `app/(app)/statistics/`, `app/(app)/transaction/`, `app/(app)/paywall.tsx`
- `app/select-currency.tsx`
- `src/entities/account/`, `src/entities/budget/`, `src/entities/category/`, `src/entities/currency/`, `src/entities/transaction/`, `src/entities/subscription/`
- `src/features/create-account/`, `src/features/create-category/`, `src/features/delete-account/`, `src/features/delete-category/`, `src/features/delete-currency/`, `src/features/search-currencies/`, `src/features/statistics/`
- `src/screens/accounts/`, `account-overview/`, `add-currency/`, `backup/`, `budget-overview/`, `budgets/`, `categories/`, `create-account/`, `create-budget/`, `create-category/`, `create-transaction/`, `currencies/`, `data/`, `edit-budget/`, `expense-category-overview/`, `export/`, `import/`, `income-category-overview/`, `paywall/`, `select-currency/`, `statistics/`, `statistics-overview/`, `transaction-overview/`, `transactions/`
- `src/widgets/account-picker/`, `budget/`, `category-picker/`, `currency-list/`, `currency-selector/`, `month-selector/`, `time-range-control/`, `transaction/`, `transaction-list/`, `sheet/SheetBudgetLeftInfo/`
- `src/shared/database/` (and the WatermelonDB decorator override in `babel.config.js`, the `simdjson` extraPod + `@nozbe/*` deps)
- `src/shared/backup/` (and the `react-native-cloud-storage` dep + its plugin/iCloud container in `app.config.js`)
- `src/shared/config/currencies/`, `src/shared/config/appLimits/`
- `src/shared/ui-primitives/CategoryIconPicker/`, `WalletIconPicker/`, `NumericPad/` (finance-specific; keep only if reused)
- Deps to remove with the above: `@nozbe/watermelondb`, `react-native-cloud-storage`, `react-native-purchases`, `@shopify/react-native-skia` (unless charts are reused), `fuse.js` (currency search), `expo-document-picker`/`expo-sharing` (backup import/export — re-add later for driver document upload if useful)
- `app.config.js` cleanup: `com.android.vending.BILLING` permission, `react-native-cloud-storage` plugin block, Sentry org/project values, Firebase files (`google-services.json`, `GoogleService-Info.plist` — replace with our own or drop `@react-native-firebase/*`)
- Onboarding assets: `assets/images/onboarding/*` (replace with driver-branded imagery)

Keep out of scope until decided: `src/entities/auth` (biometric lock — keep), Skia chart internals under `src/screens/statistics` (extract before deleting if we want charts later).

## 8. Risks & unknowns

- **Bleeding-edge versions.** Expo SDK 56 / RN 0.85.3 / React 19.2.3 / Reanimated 4 + `react-native-worklets` are all very recent; third-party libs (bottom-sheet, keyboard-controller, MMKV 4, Skia pinned at 2.6.9 with `expo.install.exclude`) are pinned to make this combination work. Any dependency change should go through `npx expo install` and be tested on device.
- **TypeScript 6.0 vs monorepo TS.** The template uses `typescript ~6.0.3` (`ignoreDeprecations: "6.0"`); the monorepo packages are on the workspace catalog's TS. Sharing `@repo/api` / `@repo/auth` types across that boundary may surface compiler-version skew — verify before committing to direct type imports.
- **Workspace adoption.** The template is npm-based and outside pnpm workspace globs. Moving it under `apps/` means: pnpm hoisting vs Metro resolution (needs `watchFolders`/`nodeLinker` care), Expo autolinking across a monorepo, and reconciling its eslint/prettier/tsconfig with `tooling/*` and `packages/tsconfig`. This is the single biggest unknown in effort terms.
- **No push notifications exist.** The plan assumed keepable push plumbing; there is none. `expo-notifications` + a token-registration procedure (likely in `packages/api/modules/notifications`) must be built from scratch — TODO already lists this, but it is additive work, not rewiring.
- **No account auth screens exist.** Login/signup UI must be built (form kit helps, but design work is real).
- **Committed third-party credentials.** `google-services.json` / `GoogleService-Info.plist` are the template author's Firebase apps; Sentry org/project (`money-plus`/`moneyra-app`) is hardcoded in `app.config.js`; `iCloud.com.moneyra.backups` container in the cloud-storage plugin. All must be replaced or removed before any build we distribute.
- **License.** NativeLaunch Pro is a paid template — confirm the license permits use inside this product and this (private) repo, and whether attribution/branding constraints apply.
- **Offline-first defaults.** `queryClient.ts` sets `networkMode: 'offlineFirst'` with week-long gcTime; sensible for a local app, but revisit for server-backed data (stale sessions, auth errors while "offline").
- **i18n key churn.** All locale files are finance-domain; `gen:i18n` will regenerate keys, but translated FR content for driver flows is new work.
- **Firebase decision.** Keeping `@react-native-firebase/*` costs native build complexity (`useFrameworks: 'static'`, `forceStaticLinking` in `app.config.js`). If we don't need GA4-style analytics, dropping it simplifies builds; decide early.

## 9. Suggested Phase 7 task breakdown

1. Archive https://nativelaunch.dev/docs into `docs/nativelaunch/` (already in TODO) — do this before modifying the vendor copy.
2. Decide adoption model: copy `vendor/moneyra-template` → `apps/mobile` under pnpm workspace (rename app identity in `env.js`: name/slug/scheme/bundle id), keep `vendor/` copy pristine as reference.
3. Get the untouched template building locally (`npm i && npx expo prebuild && expo run:ios|android`) to establish a known-good baseline before surgery.
4. Monorepo integration: pnpm workspace entry, Metro monorepo config (`watchFolders`, resolver), shared tsconfig/eslint alignment, verify `@repo/api` type imports compile under the app's TS.
5. Gut pass (Section 7 list): delete finance routes/screens/entities/widgets, WatermelonDB, backup, RevenueCat, currencies; clean `app.config.js`, `babel.config.js`, deps; keep app booting to a stub Home tab after each deletion batch.
6. Env & config: add `EXPO_PUBLIC_API_URL` to `env.js`; replace/remove Firebase config files; re-point or stub Sentry.
7. Better Auth server prep: add `expo()` plugin in `packages/auth/auth.ts`, app scheme in trusted origins.
8. Better Auth mobile client: add `@better-auth/expo` + `expo-secure-store`, create `authClient`, build `(auth)` group (login / signup / magic-link / forgot-password) with FinalFormKit, replace `app/index.tsx` gate with session check, guard `(app)` group; keep `AuthLocal` as optional app-lock.
9. oRPC client: `createORPCClient` + `RPCLink` → `/api/rpc` typed by `ApiRouterClient`, cookie header from `authClient.getCookie()`, `createTanstackQueryUtils` on the existing persisted QueryClient; smoke-test `drivers.getMyProfile`.
10. Rebuild tab shell: Home / Jobs / Messages / Profile in `TabLayout`, stub screens wired to real procedures where they exist (`drivers.*`).
11. Driver profile management screens on existing procedures (profile, certifications, documents + `createDocumentUploadUrl` upload flow, experience, trucks).
12. Driver onboarding flow (signup → voice intake → review → `upsertProfile`), per existing TODO item.
13. Push notifications: add `expo-notifications`, token-registration procedure in `packages/api/modules/notifications`, fan-out (existing TODO item).
14. i18n cleanup: prune finance namespaces, `gen:i18n`, keep en + fr.
15. CI/EAS: create our EAS project (owner/projectId in `env.js`), adapt `checks.yaml` to monorepo CI, set up EAS secrets; add at least a minimal test runner (jest-expo or vitest) to close the testing gap.
