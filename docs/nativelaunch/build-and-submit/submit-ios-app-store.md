---
title: "Submit IOS to App Store"
source: https://nativelaunch.dev/docs/build-and-submit/submit-ios-app-store
fetched: 2026-07-07
---

# Submit IOS to App Store

> A guide to publishing your iOS app via GitHub Actions and EAS Submit.

To submit your iOS app to the App Store, this template provides **two GitHub Actions workflows** powered by **EAS Build and Submit**:

-   **Cloud build** (`eas-build-cloud.yml`) — the app is built on Expo’s servers (EAS Cloud).
-   **Local build** (`eas-build-local.yml`) — the app is built on a GitHub-hosted (or self-hosted) runner using the `--local` flag, without relying on Expo’s servers.

Both workflows support the same inputs (`platform`, `profile`, `auto_submit`) and use the same environment names (`production`, `preview`). You can choose whichever path fits your project best.

For small projects, the **Cloud** option is usually faster to set up. The **Local** option gives you full control and avoids Expo Cloud limits, but requires more setup on GitHub runners.

We ship to the App Store using the **production** profile by default. If you need _preview_ or _staging_, follow the [GitHub Environments](../environments/github-environments.md) guide to create additional environments and secrets. Some services (e.g., Supabase, RevenueCat, OneSignal) may require separate projects/keys per environment.

* * *

## Prerequisites

To submit your iOS app to the App Store, you need:

-   An active [Apple Developer account](https://developer.apple.com/account/) ($99/year)
-   An [Expo account](https://expo.dev/signup) for building and submitting your app using EAS
-   A properly configured GitHub repository with your app code and GitHub Actions
-   Your app linked to an Expo project via `eas init`
-   **GitHub Environments** set up (at least `production`, optionally `preview`) — see [GitHub Environments](../environments/github-environments.md)
-   A [Sentry account](https://sentry.io/) if you're using `sentry-expo` for error tracking

Once you've registered and connected your Apple Developer and Expo accounts, and configured your GitHub project, you can submit your app using GitHub Actions.

## 1\. Prepare Your App for Submission

Before you can submit your app, make sure:

-   The app is fully developed and tested
-   All required assets are in place (icons, splash screens, screenshots, descriptions)
-   App metadata is ready on [App Store Connect](https://appstoreconnect.apple.com/)

You can use Expo’s documentation to [prepare your app for submission](https://docs.expo.dev/submit/introduction/).

* * *

## 2\. Create Expo Account

Before proceeding, create a free [Expo account](https://expo.dev/signup). It’s required to build and submit iOS apps using Expo Application Services (EAS).

* * *

## 3\. Link the Project to Expo

This template already includes the `eas.json` and `.eas/` folders.

However, you must link the project to **your own Expo account** to use builds and submissions.

To link the project, run:

```
npx eas init --id-only
```

This will link the current project to your Expo account and create `.eas/project.json`.

To confirm the link:

```
npx eas project:view
```

You should see your Expo username and linked project name.

* * *

## 4\. Set up eas.json

This template already includes a basic `eas.json`. You only need to update one field:

eas.json

```
{
  "cli": {
    "version": ">=3.0.0"
  },
  ****
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "YOUR_ASC_APP_ID"
      }
    }
  }
}
```

### 🔍 What is ascAppId?

It’s the **App Store Connect App ID**, assigned when you register your app on [App Store Connect](https://appstoreconnect.apple.com/).

You’ll find it in the app URL:

```
https://appstoreconnect.apple.com/apps/<ascAppId>
```

Replace the value with your actual ID:

```
"ascAppId": "YOUR_ASC_APP_ID"
```

![setup eas](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-1.3la1v3rpv3sle.webp&w=3840&q=75)

* * *

## 5\. Generate an Expo Access Token

Expo needs a personal access token to build apps from GitHub.

1.  Run this locally:

```
npx expo login
npx expo token:access
```

2.  Go to your GitHub repo → **Settings → Secrets → Actions → New repository secret**
    
3.  Add:
    

-   **Name**: `EXPO_TOKEN`
-   **Value**: (paste the token)

This token will authenticate EAS builds from GitHub Actions. ![expo token](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-2.3gcxfon36-nx1.webp&w=3840&q=75)

We keep `EXPO_TOKEN` as a **Repository secret** (global). Environment-specific keys (Supabase, RevenueCat, OneSignal, etc.) live in **GitHub Environments**.

* * *

## 6\. Run eas credentials locally (important)

Before triggering a GitHub Action for iOS builds, you must configure your credentials locally:

If you skip this step, your GitHub Action will fail with a `Credentials are not set up` error.

### What you need:

-   Access to an [Apple Developer account](https://developer.apple.com/account/)
-   A machine with Node.js and Expo CLI installed (`npx expo install eas-cli`)

### Step 1: Start credentials setup

In your terminal, run:

```
npx eas credentials
```

### Step 2: Configure Build Credentials

Select:

```
Build Credentials: Manage everything needed to build your project
```

Then complete the setup:

-   Log into your Apple Developer account
-   Choose your team
-   Either:
    -   Let Expo generate or upload your own Distribution Certificate
    -   Let Expo manage or upload your own Provisioning Profile

Alternatively, you can upload your existing credentials manually (e.g., a `.p12` certificate and `.mobileprovision` profile exported from App Store Connect) via the Expo dashboard.

Once uploaded, you can view and manage these credentials in your Expo dashboard. ![setup eas](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-3.2-hb75g4-xi0b.webp&w=3840&q=75)

### Step 3: Configure App Store Connect API Key

Return to the main `eas credentials` menu, and then select:

```
App Store Connect: Manage your API Key
```

Choose one of the following:

-   Use an existing API Key for EAS Submit (recommended if you already have one)
-   Add a new API Key for EAS Submit (Expo will generate and configure it automatically)

![setup eas](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-4.13w-8hind-8s8.webp&w=3840&q=75)

Both steps are required — Build Credentials and API Key. Otherwise, `eas submit --non-interactive` will fail.

Once completed, credentials (cert + provisioning profile) will be stored on Expo’s servers.

Now you’re ready to automate iOS builds with GitHub Actions.

* * *

## 7\. Configure Sentry Integration

If you use [Sentry](https://sentry.io/) to monitor your app, you can integrate it with EAS builds to automatically upload source maps and native debug symbols.

### Required secrets:

-   `SENTRY_AUTH_TOKEN`: Create one from your Sentry account [here](https://sentry.io/settings/account/api/auth-tokens/) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-6.2a1k3oka0v4mn.webp&w=3840&q=75)
-   `EXPO_PUBLIC_SENTRY_DSN`: Copy from your Sentry project settings ![NativeLaunch sentry](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-7.29kwc8jsx47gl.webp&w=3840&q=75)

### Sentry CLI setup:

Expo CLI will automatically detect these variables during build and upload source maps.

More info: [Expo + Sentry integration](https://docs.expo.dev/guides/using-sentry/)

* * *

## 8\. Configure Environment Variables & Secrets

Where you store secrets depends on which workflow you use:

-   **EAS Cloud** (`.github/workflows/eas-build-cloud.yml`) Store runtime env and secrets **in Expo** (Project → Secrets). Follow the Cloud guide: [GitHub Environments](../environments/github-environments.md)
    
-   **EAS Local on GitHub runner** (`.github/workflows/eas-build-local.yml`) Store runtime env in **GitHub Environments** (e.g., `production`, `preview`), and global tokens as **Repository secrets**. Follow the Local guide: [Expo Environment Variables](../environments/expo-environments.md)
    

* * *

## 9\. Trigger the GitHub Action

Depending on your deployment path, run the appropriate workflow:

-   **EAS Cloud** → `.github/workflows/eas-build-cloud.yml` (builds on Expo’s servers, can auto-submit).
-   **EAS Local** → `.github/workflows/eas-build-local.yml` (builds on a GitHub runner using `--local`).

From the **Actions** tab in your repository, select the workflow and provide the inputs:

-   `platform`: `ios`
-   `profile`: `production` (or `preview`)
-   `auto_submit`: `true` to auto-submit to TestFlight
-   `use_self_hosted`: `true` if using your own runner (only for Local builds)

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-9.1v6x4r8wcp9ha.webp&w=3840&q=75)

Pick **only one** workflow per release: either Cloud or Local. Both workflows share the same environment names (`production`, `preview`), so you can switch anytime.

* * *

## 10\. Submit to TestFlight

After a successful build and submission:

-   The app will be uploaded to App Store Connect’s **TestFlight** section
-   You can then go to [App Store Connect](https://appstoreconnect.apple.com/apps) → **My Apps** → your app → **TestFlight** tab
-   From there, you can add internal/external testers and submit the app for review

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-10.39eyz78lmna1q.webp&w=3840&q=75)

🎉 Once your app is approved, it will be available on the App Store for users to download.

* * *

## Resources

[

### Expo Account

Create a free Expo account



](https://expo.dev/signup)[

### App Store Connect

Manage your iOS apps and TestFlight builds



](https://appstoreconnect.apple.com/)[

### EAS Submit

Expo documentation on submitting apps



](https://docs.expo.dev/submit/intro/)[

### EAS Build

Expo documentation on building apps



](https://docs.expo.dev/build/introduction/)
