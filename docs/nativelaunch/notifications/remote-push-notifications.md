---
title: "Remote Push Notifications"
source: https://nativelaunch.dev/docs/notifications/remote-push-notifications
fetched: 2026-07-07
---

# Remote Push Notifications

Remote push notifications are delivered from the cloud using [OneSignal](https://onesignal.com). They allow you to notify users even when the app is closed.

We don’t duplicate the official OneSignal guide. Follow their [Expo setup](https://documentation.onesignal.com/docs/react-native-expo-sdk-setup) for full, up‑to‑date steps, and use this page as a concise checklist tailored to this template.

## Setup OneSignal

To start sending push notifications with OneSignal, configure your OneSignal app for the platforms you support (Apple APNs, Google FCM).

Create or select your app in [OneSignal dashboard](https://dashboard.onesignal.com/). ![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_1.3lzl8xqg4pul1.webp&w=3840&q=75)

Configure iOS (Apple Keys & App Groups) and Android (Firebase FCM). ![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_2.0p7__sxvx_sw9.webp&w=3840&q=75)

Configure platform credentials Follow the prompts based on your platforms:

-   Android: [Set up Firebase Credentials](https://documentation.onesignal.com/docs/android-firebase-credentials)
-   iOS: [p8 Token (Recommended)](https://documentation.onesignal.com/docs/ios-p8-token-based-connection-to-apns) or p12 Certificate

Click Save & Continue after entering your credentials.

Choose target SDK ![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_3.0qotzay33xjyg.webp&w=3840&q=75) ![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_4.1gnr0qj9ohflf.webp&w=3840&q=75)

Once your platform is configured, your OneSignal App ID will be displayed. Copy and save this ID—you’ll need it when installing and initializing the SDK. ![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_5.3fa_uips3oi1h.webp&w=3840&q=75) Add your OneSignal App ID to project environment variables:

```
EXPO_PUBLIC_ONESIGNAL_APP_ID=your-app-id
```

Update `app.config.ts`

The **onesignal-expo-plugin** is already installed and configured in this template. You only need to ensure your environment variables are wired correctly into the config.

app.config.ts

```
export default ({ config }) => ({
  ios: {
    entitlements: {
      'aps-environment': 'development', // ✅ Required for push notification, change to "production" for Testflight and App Store builds
      'com.apple.security.application-groups': ['group.${ios.bundleIdentifier}.onesignal'],
    },
  }
})
```

## Sending notifications

You can send notifications from the OneSignal dashboard:

![onesignal push notifications](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fonesignal_test.163ekb7h2vnxk.webp&w=3840&q=75)

For automated messages, use **Segments**, **Filters**, or **Test Subscriptions** (great for QA devices).

* * *

## Resources

[

### Expo + OneSignal

Expo SDK setup



](https://documentation.onesignal.com/docs/react-native-expo-sdk-setup)[

### iOS p8 token-based connection to APNs

IOS Platform credential setup



](https://documentation.onesignal.com/docs/ios-p8-token-based-connection-to-apns)
