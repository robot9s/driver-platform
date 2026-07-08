---
title: "App configuration"
source: https://nativelaunch.dev/docs/setup/configuration
fetched: 2026-07-07
---

# App configuration

NativeLaunch uses a single configuration entry point — **`env.js`** — which defines all environment-specific values and validates them automatically.

This replaces manual editing of `.env` files or `app.config.js` constants.

Note

-   The `env.js` file acts as a central entry point for configuration and validation, but it doesn't mean all values are meant to be customized there.
-   Some identifiers (like the base bundle ID, package name, or team ID) are intentionally hard-coded to ensure a consistent project structure across builds.
-   You can still override environment-specific values using secrets in CI (for example, in GitHub Actions).

Quick start

To run the project locally, you only need a [**Supabase account**](../supabase/setup.md). Set up a new Supabase project and fill in your project URL and anon key in the `.env` file. This allows you to start the app in under 10 minutes. Other integrations, such as Google Sign-In or OneSignal notifications, can be configured later.

* * *

## Centralized configuration

The `env.js` file is located in the project root. It loads your `.env` file, validates all required variables with [Zod](https://zod.dev), and injects them into Expo during build time.

env.js

```
import path from 'path'
import {z} from 'zod'
import pkg from './package.json' assert {type: 'json'}

const APP_ENV = process.env.APP_ENV ?? 'development'
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`)
require('dotenv').config({path: envPath})

// Base identity
const BASE_BUNDLE_ID = 'com.nativelaunch.app'
const BASE_PACKAGE = 'com.nativelaunch.app'
const APP_NAME = 'NativeLaunch'
const SCHEME = 'nativelaunch'

// Add environment suffix for dev/staging
const withEnvSuffix = (name) =>
  APP_ENV === 'production' ? name : `${name}.${APP_ENV}`

// Zod schema ensures correctness
const client = z.object({
  APP_ENV: z.enum(['development', 'preview', 'production']),
  NAME: z.string(),
  SCHEME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  EXPO_PUBLIC_SUPABASE_PROJECT_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: z.string().optional(),
  EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME: z.string().optional(),
  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: z.string().optional(),
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: z.string().optional(),
  EXPO_PUBLIC_ONESIGNAL_APP_ID: z.string().optional(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
})

// Values merged and validated
const Env = client.parse({
  APP_ENV,
  NAME: APP_NAME,
  SCHEME,
  BUNDLE_ID: withEnvSuffix(BASE_BUNDLE_ID),
  PACKAGE: withEnvSuffix(BASE_PACKAGE),
  VERSION: pkg.version,
  ...process.env,
})

export {Env}
```

This file now controls **everything** — bundle IDs, packages, validation, and feature toggles like OneSignal, Google Sign-In, RevenueCat, and Sentry.

If `EXPO_PUBLIC_ONESIGNAL_APP_ID` or `EXPO_PUBLIC_REVENUECAT_API_KEY_*` are missing, the SDK initialization will be safely skipped and a console warning will appear:

```
[OneSignal]: ⚠️ Disabled — App ID not set in .env file.
[RevenueCat]: ⚠️ Disabled — no API key set for this platform.
```

* * *

## Environment variables

NativeLaunch uses a single `.env` file in the project root. This file contains only the public environment variables needed for local development and builds.

During deployment, environment variables for other profiles (like `preview` or `production`) are injected automatically from CI/CD secrets — you don't need multiple `.env` files locally.

.env

```
APP_ENV=production
EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://xxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
EXPO_PUBLIC_SENTRY_DSN=
```

I personally prefer to work in a single environment (`APP_ENV=production`) by default. Maintaining multiple environments for small projects can be complex and unnecessary. However, if your project requires it, you can easily set up additional environments. Learn more here: [Environments Overview](../environments/overview.md)

EXPO\_PUBLIC\_ prefix

Only variables prefixed with `EXPO_PUBLIC_` are injected into your client-side code. Private keys (like Supabase service role or Stripe secret) must stay server-side and are typically passed through GitHub Secrets or your deployment environment.

* * *

## EAS configuration

You don’t need to manually configure **EAS** to build or publish your app — everything is already set up in the project’s `eas.json` and GitHub Actions workflow.

By default, builds are linked to your `env.js` and `.env` setup. The correct environment (`development`, `preview`, or `production`) is automatically applied based on the selected **build profile** during EAS build or CI.

If you wish to modify build settings (like distribution method, channels, or submission details), you can safely edit `eas.json` following the [EAS configuration schema](https://docs.expo.dev/eas/json/).

[

### EAS Build Configuration

docs.expo.dev



](https://docs.expo.dev/build/eas-json/)
