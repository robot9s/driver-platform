# vendor/

Third-party code vendored into the monorepo, deliberately **outside** the pnpm
workspace globs (`apps/*`, `packages/*`, `tooling/*`) so it does not affect
installs or builds until it is intentionally wired in.

## moneyra-template

Premium NativeLaunch Expo app, copied unmodified from
`robot9s/driver-platform-expo-app` @ `5198445` (2026-07-07). It is the intended
base for the driver mobile app (see `ARCHITECTURE.md` — mobile driver app, and
`TODO.md` Phase 7): keep the app shell, auth wiring, navigation and UI kit; gut
the finance-domain screens; point its API client at the driver-platform oRPC
`/api` + Better Auth. When that work starts, move it to `apps/mobile` and adopt
it into the workspace. Vendor docs: https://nativelaunch.dev/docs
