---
title: "Tech Stack"
source: https://nativelaunch.dev/docs/tech-stack
fetched: 2026-07-07
---

# Tech Stack

> A detailed look at the technical details of the mobile stack

NativeLaunch is based on [Expo](https://expo.dev), which simplifies the process of building native apps using React Native. It allows fast iteration, OTA updates, and shared code between iOS and Android with a unified developer experience.

[

### 

![react-native](https://nativelaunch.dev/_next/static/media/reactnative.04i0vx64lr0sg.svg)React Native (0.85)

reactnative.dev



](https://reactnative.dev)[

### 

![expo](https://nativelaunch.dev/_next/static/media/expo.2p__gujcmz-6-.svg)Expo (SDK 56)

expo.dev



](https://expo.dev)

* * *

## Backend & Auth

We use [Supabase](https://supabase.com) as a backend-as-a-service solution, providing authentication, database, file storage, and edge functions.

[

### 

![supabase](https://nativelaunch.dev/_next/static/media/supabase.2w6abc93v9n-6.svg)Supabase

Auth, PostgreSQL database, file storage, and edge functions in one platform.



](https://supabase.com)

* * *

## Subscriptions

[RevenueCat](https://revenuecat.com) is used to manage in-app purchases and subscriptions on both iOS and Android with unified APIs.

[

### 

![revenueCatImg](https://nativelaunch.dev/_next/static/media/revenueCat.3728x-xc35op2.svg)RevenueCat

In-app subscription management for iOS and Android.



](https://www.revenuecat.com/)

* * *

## Analytics & Monitoring

NativeLaunch provides built-in integration with Google Analytics and Sentry to track user behavior and monitor runtime errors in production.

[

### 

![ Google Analytics](https://nativelaunch.dev/_next/static/media/google-analytics.1bkw2f473msva.svg)Google Analytics

Screen tracking and event logging via Measurement Protocol.



](https://analytics.google.com/)[

### 

![sentry](https://nativelaunch.dev/_next/static/media/sentry.40y15ltqx0hpw.svg)Sentry

Error monitoring and performance tracing for React Native apps.



](https://sentry.io)

* * *

## Push notifications

[OneSignal](https://onesignal.com/) provides cross-platform push notifications for iOS and Android, with support for in-app messages and advanced targeting

[

### 

![OneSignal](https://nativelaunch.dev/_next/static/media/oneSignal.3b7zln604-4ld.svg)OneSignal

Cross-platform push notifications for iOS and Android.



](https://onesignal.com/)

* * *

## UI & Styling

NativeLaunch uses **UniWind + HeroUI Native** as the default UI & styling stack. **NativeWind** is available as part of the **Pro** tier (Moneyra app).

### UniWind stack (default)

[

### 

![nativewind](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Funiwind.1bsnb5ny5d7pc.webp&w=96&q=75)UniWind

Modern utility-first styling solution for React Native, built on Tailwind CSS v4.



](https://www.uniwind.dev/)[

### 

![rnr](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fheroui-native.3b3zachb0kctc.webp&w=96&q=75)HeroUI Native

Native-first React Native component library with built-in theming and accessibility.



](https://github.com/heroui-inc/heroui-native)

### NativeWind stack (Pro — Moneyra)

[

### 

![nativewind](https://nativelaunch.dev/_next/static/media/nativewind.43f6725yhdxby.svg)NativeWind

Tailwind CSS (v3) for styling React Native apps with full theming support. Used in the Moneyra app included with Pro.



](https://www.nativewind.dev/)[

### 

![rnr](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Freact-native-reusables.32z9hqrj7hfkn.webp&w=1920&q=75)React Native Reusables

Headless UI primitives and reusable components for React Native.



](https://github.com/founded-labs/react-native-reusables)

* * *

## Cloud Services

NativeLaunch uses EAS (Expo Application Services) to build and deploy mobile apps and push over-the-air updates.

[

### 

![expo](https://nativelaunch.dev/_next/static/media/expo.2p__gujcmz-6-.svg)Expo EAS

Cloud builds, store deployments, and OTA updates for Expo apps.



](https://expo.dev/eas)

* * *

## Forms & Validation

Forms are built using [React Hook Form](https://react-hook-form.com), with schema-based validation powered by [Zod](https://zod.dev). This ensures strong typing, reusable schemas, and tight integration with the UI.

[

### 

![react-hook-form](https://nativelaunch.dev/_next/static/media/react-hook-form.3nx4xv_wulnwb.svg)React Hook Form

Performant form state management with minimal re-renders.



](https://react-hook-form.com)[

### 

![zod](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fzod.3rwzf_q9ej3bj.webp&w=32&q=75)Zod

Type-safe schema validation used across forms and API layers.



](https://zod.dev)

* * *

## State & Persistence

Global state is managed with [Zustand](https://github.com/pmndrs/zustand), and persistent storage is powered by [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv). React Query is also included to handle caching and async data management.

[

### 

Zustand

Lightweight state management with hooks and persistence support.



](https://github.com/pmndrs/zustand)[

### 

MMKV

Fast key-value storage for React Native with encryption support.



](https://github.com/mrousavy/react-native-mmkv)

* * *

## Monorepo setup

In addition to the single-app starter, NativeLaunch also provides a **monorepo-based starter** for larger projects and shared codebases, built on **Turborepo**.

[

### 

![expo](https://nativelaunch.dev/_next/static/media/turborepo.0ej1cirj-4lp5.svg)Turborepo

Monorepo tooling for shared packages, faster builds, and scalable workflows.



](https://turborepo.dev)
