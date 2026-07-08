---
title: "Frequently Asked Questions"
source: https://nativelaunch.dev/docs/faq
fetched: 2026-07-07
---

# Frequently Asked Questions

Answers to common questions about using **EAS**, **GitHub Actions**, and deploying your app with the NativeLaunch template.

* * *

### Will the app work right after I install dependencies?

Yes, the project will start and render the UI out of the box after running:

```
npm install
npx expo run:ios
npx expo run:android
```

However, features like **authentication** and **notes** require configuration.

**Fastest way to get started:**

-   Configure Supabase with **email-based login** first — this is the quickest method and requires minimal setup.

**Optional (can be done later):**

-   Set up Google and Apple login
-   Configure RevenueCat for subscriptions
-   Add Sentry for error monitoring

You can start developing and testing most features without all integrations set up.

* * *

### I don't know some technology! Should I still buy it?

Absolutely. NativeLaunch is designed to be beginner-friendly. Even if you're not familiar with certain tools (e.g., Supabase, RevenueCat, Sentry, EAS), the documentation will guide you step-by-step.

You can start with just the basics (e.g., authentication and navigation), and gradually integrate more advanced tools as you grow confident. You don’t need to know everything up front to benefit from the template.

* * *

### What platforms does NativeLaunch support?

NativeLaunch supports both **iOS** and **Android** out of the box using the same codebase.

You can build and deploy apps for:

-   iPhone and iPad via App Store Connect (TestFlight and production)
-   Android phones and tablets via Google Play (internal, open, production tracks)

* * *

### Why do we use --local for builds?

Using the `--local` flag means the app is built directly inside a **GitHub-hosted runner**, not on Expo’s build servers. This has strategic implications:

-   You avoid Expo's build limits, which are restrictive on the free tier
-   You consolidate CI/CD costs into GitHub (if you're already paying for GitHub Actions minutes)
-   You can run builds and submissions without needing an EAS Build subscription

While it's possible to omit `--local` and build on Expo’s cloud, those builds will count against your EAS quota — and may be throttled or blocked once you hit the free limit.

This setup gives you more flexibility and better cost control, especially for indie projects or startups using GitHub CI/CD.

* * *

### Where do I find my ascAppId for iOS?

Go to [App Store Connect](https://appstoreconnect.apple.com/apps), open your app, and copy the ID from the URL:

```
https://appstoreconnect.apple.com/apps/<ascAppId>
```

* * *

### Where are my credentials stored?

Once you run `npx eas credentials` and set up your build profiles, credentials like distribution certificates and provisioning profiles are securely stored on Expo’s servers.

You can view and manage them at: [expo.dev/accounts/YOUR\_USERNAME/credentials](https://expo.dev/accounts/YOUR_USERNAME/credentials)

* * *

### What are preview and development profiles for?

By default, we only use the `production` profile. Other profiles like `preview` or `development` are optional and intended for staging/testing purposes. To use them, you’ll need to configure separate environments, services, and possibly credentials.

* * *

### How do I update my app version?

The `production` profile uses:

```
"autoIncrement": true
```

Each build automatically bumps the version number. You can also manually control it via `app.config.ts` or the `expo.version` field.

* * *

### Can I rebuild or resubmit manually?

Yes. You can rerun the GitHub Action from the **Actions** tab or trigger it manually with parameters. Alternatively, you can run locally:

```
eas build --local --platform ios --profile production
eas submit --platform ios --profile production --path ./app.ipa
```

* * *

### Can I use my own backend?

Yes. The template is backend-agnostic. It uses Supabase for convenience, but you can connect any backend by updating API calls and environment variables.

* * *

### Why am I getting an authentication error in my app?

If you see an error like `session not found`, `401 unauthorized`, or are unexpectedly logged out:

**Common causes:**

-   Your `SUPABASE_ANON_KEY` or `SUPABASE_URL` is missing or incorrect
-   You're calling Supabase methods without being authenticated
-   The session has expired but the app didn't refresh tokens properly

**Steps to resolve:**

-   Ensure secrets are correctly set in GitHub → Settings → Secrets
-   Make sure the Supabase client is initialized early and session recovery is handled properly
-   Check your Supabase Auth policies (RLS) and logs

* * *

Didn't find your question? Check the Troubleshooting page or ask us via Contact Us form.
