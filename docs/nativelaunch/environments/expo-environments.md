---
title: "Expo Environment Variables"
source: https://nativelaunch.dev/docs/environments/expo-environments
fetched: 2026-07-07
---

# Expo Environment Variables

We use **Expo (EAS) Environment Variables & Secrets** when building in **EAS Cloud**. Variables are injected at build/submit time on Expo’s servers and can be exposed to the app at runtime if they start with `EXPO_PUBLIC_`.

This page is only relevant if you deploy with **EAS Cloud**. If you build **locally on GitHub runners**, use [GitHub Environments](./github-environments.md) instead.

* * *

## Setup

1.  Open your project on **expo.dev** → **Project → Secrets**. Add your keys one by one. ![expo secrets](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpo-secrets-1.3fn-pjtfvliuj.webp&w=3840&q=75) ![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpo-secrets-2.17w5p61fwr0jm.webp&w=3840&q=75)
    
2.  If you use two Expo projects (preview/prod), repeat this step in each project so the names stay identical.
    

Keeping identical names across environments simplifies CI and code. Only values differ between projects.

Inside each environment click **Add secret** and create the **same keys** in both `preview` and `production`:

```
EXPO_PUBLIC_SUPABASE_PROJECT_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME=
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=
EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID=
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_ONESIGNAL_APP_ID=
```

![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpo-secrets-3.3mdwustr9hlmd.webp&w=3840&q=75)

* * *

## Takeaway

-   ✅ Store variables in **Expo project Secrets** when building in EAS Cloud.
-   ✅ Use `EXPO_PUBLIC_*` only for values that can be bundled into the app.
-   ✅ Use build profiles (`preview`, `production`) and optional `env` overrides in `eas.json`.
-   ✅ For strict isolation, use **two Expo projects** (preview/prod) with identical variable names.
-   ❌ Do not commit `.env.*` with real values to the repo.

* * *

## Resources

[

### Expo Project → Secrets

Manage variables in the Expo dashboard



](https://expo.dev/)[

### EAS Secrets (CLI)

Docs on secrets & environment variables



](https://docs.expo.dev/build-reference/variables/)
