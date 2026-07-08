---
title: "Installation"
source: https://nativelaunch.dev/docs/setup/installation
fetched: 2026-07-07
---

# Installation

Before using **NativeLaunch**, make sure you have the following tools installed on your system. Here's a step-by-step guide to setting up the tooling needed for React Native and Expo development. This is a prerequisite for setting up the NativeLaunch project.

## Required Tools

Before you begin, make sure the following is installed on your system:

-   [Node.js](https://nodejs.org/en/) (20.19.4 or higher)
-   [Git](https://git-scm.com/)
-   [Homebrew](https://brew.sh/)

* * *

## Run on Simulator

Follow the steps bellow to get the core application up and running in under 5 minutes. After that you can start activating other services or setting up any of the demo applications.

Expo Go limitations

This template uses native modules that **cannot run in Expo Go**. Some examples include:

-   `react-native-mmkv` (storage)
-   Authentication (Google / Apple)
-   Push Notifications
-   In-App Purchases (RevenueCat)
-   Error tracking (Sentry)

👉 To use these features, please run the project with **EAS Build** or `expo prebuild` and a custom development client.

### Set up environment

We won't copy the official docs, as there is quite a bit of setup you need to make to get started with iOS and Android development and it also depends what approach you want to take.

[Check this official setup guide to get started](https://docs.expo.dev/get-started/set-up-your-environment/). After you're done with the setup, go back to this guide and continue with the next step.

You can pick if you want to develop the app for iOS or Android by using the real device or the simulator.

Recommendation

We recommend using the simulators and development builds for development, as it is more real and reliable approach. It also won't limit you in terms of native dependencies (required for e.g. analytics).

Of course, you can start with the simplest approach (using Expo Go) and when you iterate further, switch to different approach.

### Get the code

Right after purchase, we send a GitHub invitation to the email you used at checkout. Accept the invite to get access to the private repository with lifetime updates.

👉 If your GitHub account is registered under a different email, just add your purchase email to GitHub (GitHub → Settings → Emails → Add email) and accept the invite again. Alternatively, reply with your GitHub username, and we’ll resend the invite.

Once you’ve accepted the invite,, **clone the repository**:

```
git clone git@github.com:nativelaunch/expolaunch-template.git your-app-name
cd your-app-name
```

By default, the project is linked to the NativeLaunch repo. If you want to push code to your own GitHub repo, reset the origin:

```
git remote set-url origin {your-git-origin}
```

Otherwise, use the **ZIP archive** from your purchase email:

1.  Download and unzip the archive.
2.  `cd` into the project folder.

Cloning the repo is recommended — it makes pulling updates easier. The ZIP is a simple fallback if you don’t use GitHub access.

### Install dependencies

```
npm install
```

### Configure the app

Before launching, configure your environment variables — this is the only setup required to run the project.

Quick setup tip

You can fully configure Supabase (including auth) in ~15 minutes — steps are clear and minimal. The app will launch even if other integrations (Google Sign-In, OneSignal, RevenueCat) are not set up — you only need Supabase to get started.

Environment variables are declared in your **`.env`** file. The centralized **`env.js`** file validates them and passes the values into Expo during build.

To run the project, you only need the following variables:

```
# .env
EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://example.supabase.com
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These two variables connect your app to **Supabase**, which handles data and authentication. Once your Supabase project is created, make sure to set up:

-   [Supabase database](../supabase/database-tables-setup.md) (tables and policies)
-   [Email login](../auth/login-with-email.md) (the simplest and fastest authentication method)

If you just want to preview the app without creating a Supabase account, you can enter any random strings for these two variables. The app will still launch and show the onboarding and login screens — but features like authentication or data sync won’t work until real keys are added.

Learn more about configuration here: [App configuration →](./configuration.md)

### Start development server

To start the application development server, run for iOS:

```
npm run ios
```

Run for Android:

```
npm run android
```

Your development server should now be running and app opening in simulator ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Finstall-1.044bd1yahko0l.webp&w=3840&q=75)

The app will start right away with local data — no extra configuration is required to preview it. However, features like **authentication**, **notes**, or **payments** will require you to finish the Supabase setup.

### What's next?

You now have **NativeLaunch** running locally 🎉 The core setup is complete — Supabase is connected, and the app is live in the simulator.

From here, you can start customizing and extending the project:

-   Add [Google](../auth/google-auth.md) or [Apple](../auth/apple-auth.md) authentication
-   Enable [push notifications](../notifications/overview.md) with OneSignal
-   Configure [in-app purchases](../payment/overview.md) with RevenueCat
-   Set up [error tracking](../monitoring.md) with Sentry
-   [Customize the app](../customization/styling.md) — theme, icons, and branding

Each integration is optional — start small, add services when you need them.

[

### App configuration

Learn how to manage environment variables and optional services.



](https://nativelaunch.dev/docs/configuration/app)[

### Social authentication

Add Google or Apple sign-in.



](https://nativelaunch.dev/docs/auth/social-login)
