---
title: "Submit Android to Google Play"
source: https://nativelaunch.dev/docs/build-and-submit/submit-android-google-play
fetched: 2026-07-07
---

# Submit Android to Google Play

> A guide to publishing your Android app on Google Play using EAS and GitHub Actions.

To submit your Android app to Google Play, this template provides **two GitHub Actions workflows** powered by **EAS Build and Submit**:

-   **Cloud build** (`eas-build-cloud.yml`) — the app is built on Expo’s servers (EAS Cloud).
-   **Local build** (`eas-build-local.yml`) — the app is built on a GitHub-hosted (or self-hosted) runner using the `--local` flag, without relying on Expo’s servers.

Both workflows support the same inputs (`platform`, `profile`, `auto_submit`) and use the same environment names (`production`, `preview`). You can choose whichever path fits your project best.

For small projects, the **Cloud** option is usually faster to set up. The **Local** option gives you full control and avoids Expo Cloud limits, but requires more setup on GitHub runners.

We ship to Google Play using the **production** profile by default. If you need _preview_ or _staging_, follow the [GitHub Environments](../environments/github-environments.md) guide to create additional environments and secrets. Some services (e.g., Supabase, RevenueCat, OneSignal) may require separate projects/keys per environment.

* * *

## Prerequisites

To submit your Android app to Google Play, you need:

-   A Google Play Developer account ($25 one-time fee)
-   An [Expo account](https://expo.dev/signup) for building and submitting your app using EAS
-   A properly configured GitHub repository with your app code and GitHub Actions
-   Your app linked to an Expo project via `eas init`

Once your accounts are set up and your app is ready, you can build and submit it using GitHub Actions.

## 1\. Prepare Your App for Submission

Before submitting your app:

-   The app should be fully developed and tested
-   Required assets (icons, splash screens, screenshots, descriptions) must be ready
-   Your app should be registered in the [Google Play Console](https://play.google.com/console/)

Refer to [Expo documentation](https://docs.expo.dev/submit/introduction/) to prepare your app.

* * *

## 2\. Create Expo Account

Create a free [Expo account](https://expo.dev/signup). It is required to build and submit Android apps using EAS.

* * *

## 3\. Link the Project to Expo

This template includes `eas.json` and `.eas/` folders. You must link the project to **your Expo account**:

```
npx eas init --id-only
```

To verify the link:

```
npx eas project:view
```

You should see your Expo username and project name.

* * *

## 4\. Set up eas.json

This template includes a basic `eas.json`. You can configure it like this:

eas.json

```
{
  "cli": {
    "version": ">=3.0.0"
  },
  "build": {
    "production": {
      "releaseChannel": "production",
      "developmentClient": false,
      "distribution": "internal"
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "internal"
      }
    }
  }
}
```

## 5\. Generate an Expo Access Token

Generate a token locally:

```
npx expo login
npx expo token:access
```

Then go to GitHub → **Settings → Secrets → Actions → New repository secret** and add:

-   **Name**: `EXPO_TOKEN`
-   **Value**: (paste the token)

This token will authenticate EAS builds from GitHub Actions. ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-android-1.3gcxfon36-nx1.webp&w=3840&q=75)

You can change `track` to `alpha`, `beta`, or `production` depending on your desired release track in Google Play.

* * *

## 6\. Run eas credentials Locally (important)

Before triggering GitHub Actions, configure Android credentials:

If you skip this step, your GitHub Action will fail with a `Credentials are not set up` error.

### Step 1: Start credentials setup

```
npx eas credentials
```

Select:

```
Keystore: Manage everything needed to build your project
```

### Step 2: Generate or provide a Keystore

You’ll be prompted:

-   Let Expo generate a new Keystore ✅ (**recommended for first-time upload**)
-   Or upload an existing `.jks` if you already published to Google Play

Expo will store this Keystore on their servers and use it to sign the app.

You can later download it using:

```
npx eas credentials -p android --download
```

* * *

## 🔐 Keystore Strategy (Dev vs Prod)

You will typically work with **two SHA-1 certificates**:

| Purpose | SHA-1 Source | Use Case |
| --- | --- | --- |
| Development | From debug keystore (`debug.keystore`) | OAuth Client ID for dev builds |
| Production | From Google Play Console → App Integrity | OAuth Client ID for release builds via Play Store |

### 🔧 How to get SHA-1

**Development SHA-1:**

```
keytool -list -v -keystore ./android/app/debug.keystore \
  -alias androiddebugkey \
  -storepass android -keypass android
```

**Production SHA-1:**

-   Go to [Google Play Console](https://play.google.com/console/)
-   Select your app → **Setup → App Integrity**
-   Copy the **App signing certificate** SHA-1 fingerprint

### Recommendation:

-   Allow EAS to generate the keystore on first upload.
-   For OAuth in dev, use SHA-1 from debug keystore.
-   For OAuth in prod (Google Sign-In, RevenueCat, etc.), use SHA-1 from Play Console.
-   If you previously uploaded an app — re-use your original `.jks` file.

* * *

## 7\. Configure Sentry Integration

If you use [Sentry](https://sentry.io/) to monitor your app, you can integrate it with EAS builds to automatically upload source maps and native debug symbols.

### Required secrets:

-   `SENTRY_AUTH_TOKEN`: Create one from your Sentry account [here](https://sentry.io/settings/account/api/auth-tokens/) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-android-2.2a1k3oka0v4mn.webp&w=3840&q=75)
-   `EXPO_PUBLIC_SENTRY_DSN`: Copy from your Sentry project settings ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-android-3.26g_scr8s97bt.webp&w=3840&q=75)

### Sentry CLI setup:

Expo CLI will automatically detect these variables during build and upload source maps.

More info: [Expo + Sentry integration](https://docs.expo.dev/guides/using-sentry/)

* * *

## 8\. Upload to Google Play

Once the `.aab` is built, you can manually upload it to the Google Play Console or use EAS Submit to automate this step.

To use EAS Submit, configure your Google Service Account and JSON key (see [Expo docs](https://docs.expo.dev/submit/android/), [First Submission of an Android App](https://github.com/expo/fyi/blob/main/first-android-submission.md)).

You can also upload the `.aab` file manually from the GitHub Actions output.

* * *

## 9\. Configure Environment Variables & Secrets

Where you store secrets depends on which workflow you use:

-   **EAS Cloud** (`.github/workflows/eas-build-cloud.yml`) Store runtime env and secrets **in Expo** (Project → Secrets). Follow the Cloud guide: [Expo Environment Variables](../environments/expo-environments.md)
    
-   **EAS Local on GitHub runner** (`.github/workflows/eas-build-local.yml`) Store runtime env in **GitHub Environments** (e.g., `production`, `preview`), and global tokens as **Repository secrets**. Follow the Local guide: [GitHub Environments](../environments/github-environments.md)
    

The exact placement of keys varies by workflow. This page does not duplicate setup steps—use the dedicated guides above.

## 10\. GitHub Actions Workflow for EAS Build & Submit

Once everything is set up, you can manually trigger the GitHub Action to build and (optionally) submit your app.

Depending on your deployment path, run the appropriate workflow:

-   **EAS Cloud** → `.github/workflows/eas-build-cloud.yml` (builds on Expo’s servers, can auto-submit).
-   **EAS Local** → `.github/workflows/eas-build-local.yml` (builds on a GitHub runner using `--local`).

From the **Actions** tab in your repository, select the workflow and provide the inputs:

-   `platform`: `android`
-   `profile`: `production` (or `preview`)
-   `auto_submit`: `true` to auto-submit to Google Play
-   `use_self_hosted`: `true` if using your own runner (**only for Local builds**)

If `auto_submit` is disabled, the build output will be saved as an artifact that you can download from the GitHub Actions UI.

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsubmit-ios-9.1v6x4r8wcp9ha.webp&w=3840&q=75)

* * *

## 11\. Submit to Google Play

Once the build and (optional) submit finishes:

-   The app will be uploaded to the selected **track** (e.g., internal or production)
-   You can go to [Google Play Console](https://play.google.com/console/) → your app → **Releases** to review and publish it

⚠️ The GitHub Action will not work the first time — you [must manually upload](https://github.com/expo/fyi/blob/main/first-android-submission.md) your first `.aab` build to Google Play Console. After the first version is reviewed and published, `eas submit` will start working normally.

🎉 Once approved, your Android app will be available on Google Play.

* * *

## Resources

[

### Google Play Console

Manage your Android apps and releases



](https://play.google.com/console/)[

### Expo Account

Create a free Expo account



](https://expo.dev/signup)[

### EAS Submit

Expo documentation on submitting Android apps



](https://docs.expo.dev/submit/android/)[

### EAS Build

Expo documentation on building apps



](https://docs.expo.dev/build/introduction/)
