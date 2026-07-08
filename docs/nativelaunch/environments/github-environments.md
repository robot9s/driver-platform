---
title: "GitHub Environments"
source: https://nativelaunch.dev/docs/environments/github-environments
fetched: 2026-07-07
---

# GitHub Environments

We use **GitHub Environments** to manage variables for both `preview` and `production`. This keeps secrets **out of the repo**, lets us reuse **the same variable names** across environments, and reduces mistakes when switching between staging and production.

This page is only relevant if you deploy **locally with GitHub Actions**. If you rely on **EAS Cloud**, you can skip this and use Expo’s environment management instead.

* * *

## Setup

1.  Open your repo → **Settings → Environments**. ![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-1.2ivla3daikjjr.webp&w=3840&q=75)
    
2.  Create two environments:
    
    -   `preview`
    -   `production`
    
    ![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-2.15zii7bauxuyc.webp&w=3840&q=75)
    

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

![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-3.25060xc3en655.webp&w=3840&q=75) ![app environment](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-4.0byeuk152i3mr.webp&w=3840&q=75)

Some secrets are **global** and don’t depend on environments (e.g. `MY_RELEASE_PLEASE_TOKEN` for release-please). Those can stay in **Repository secrets** instead of Environment secrets.

For iOS builds with **EAS Local**, you also need to provide signing credentials (`credentials.json` + provisioning profiles).

1.  Generate them locally:
    
    ```
    eas credentials -p ios
    # → Download credentials.json
    ```
    
2.  Pack into an archive:
    
    ```
    tar czf ios-creds.tar.gz credentials.json credentials/*
    ```
    
3.  Encode to base64 (macOS):
    
    ```
    base64 -i ios-creds.tar.gz > ios-creds.b64
    ```
    
    (Linux CI: `base64 ios-creds.tar.gz > ios-creds.b64`)
    
4.  Copy the content of `ios-creds.b64` and add it as a secret:
    
    ```
    EXPO_CREDENTIALS_B64=...
    ```
    

Your workflow will decode this and restore credentials before building:

```
- name: '🔑 Restore Expo credentials'
  run: |
    echo "$EXPO_CREDENTIALS_B64" | base64 -d > ios-creds.tar.gz
    tar xzvf ios-creds.tar.gz
  env:
    EXPO_CREDENTIALS_B64: ${{ secrets.EXPO_CREDENTIALS_B64 }}
```

* * *

## Takeaway

-   ✅ Keep **all variables in GitHub Environments**, not in `.env.*` committed files.
-   ✅ Use **identical names** for `preview` and `production` — workflows stay clean.
-   ✅ Select the Environment via a workflow input (`profile`) and GitHub injects the right values.
-   ❌ Don’t duplicate prod secrets locally or rename keys between environments.
