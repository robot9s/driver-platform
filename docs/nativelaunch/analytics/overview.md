---
title: "Overview"
source: https://nativelaunch.dev/docs/analytics/overview
fetched: 2026-07-07
---

# Overview

NativeLaunch uses **Google Analytics** to collect product analytics and track user behavior inside your app. This enables you to understand how users interact with key screens, features, and actions — all without writing custom tracking logic from scratch.

![supabase expo](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Foverview.1zpx56j4ti5p8.webp&w=3840&q=75)

## Why analytics matters

Analytics helps you answer questions like:

-   Which features are used most?
-   Where do users drop off during onboarding?
-   How often is the Paywall shown vs. actually converted?
-   What is the average session length or screen flow?

These insights are critical for improving retention, identifying bugs, and optimizing the user experience based on real usage data.

## What’s tracked out of the box

NativeLaunch comes with built-in Google Analytics events and screen tracking:

-   **Screen views** — all navigation between screens is tracked automatically
-   **User interactions** — buttons like `Subscribe`, `Logout`, and `Create Note`
-   **Session start/end** — when user enters or exits the app
-   **Subscription funnel** — open paywall, start checkout, complete purchase
-   **Custom events** — you can easily extend tracking for your app-specific logic

For example, you can track a custom event when a user creates a note:

```
await firebaseAnalytics.logEvent('note_created', {
  note_id: data.id,
  note_date: data.created_at,
})
```

## Related pages

[

### Google Analytics Setup

Configuring Google Analytics in your Expo project.



](https://docs.expo.dev/guides/using-firebase/)[

### Using Firebase Analytics (RN Firebase)

rnfirebase.io



](https://rnfirebase.io/)
