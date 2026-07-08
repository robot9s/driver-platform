---
title: "Google Analytics setup"
source: https://nativelaunch.dev/docs/analytics/setup
fetched: 2026-07-07
---

# Google Analytics setup

### Create a Firebase account

Visit the [Firebase Console](https://console.firebase.google.com/) and either sign in or create a new account. ![Firebase dashboard](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-1.1hhliaamxklex.webp&w=3840&q=75) ![New project button](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-2.3u0-7lamthwtz.webp&w=3840&q=75) ![Project setup form](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-3.1n2g_ys6wbtkv.webp&w=3840&q=75)

### Create a new projects for IOS and Android

You need to create a separate app registration for each platform within the same Firebase project.

#### 1\. Create a new project for IOS

-   Enter your iOS app bundle ID (e.g. `native.launch`) ![iOS app step 1](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-4.3_i5jai0f-jb2.webp&w=3840&q=75) ![iOS app step 2](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-5.2z0xgaswi9m48.webp&w=3840&q=75) ![iOS app step 3](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-6.3s_wcb428g2ms.webp&w=3840&q=75)
-   Download the `GoogleService-Info.plist` file ![iOS app step 4](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-7.20yxcysjjtxdw.webp&w=3840&q=75)
-   Place it into the root of your Xcode project directory ![iOS app config](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-7-1.04dy-c3jhhj02.webp&w=3840&q=75)

#### 2\. Create a new project for Android

-   Enter your Android package name (e.g. `native.launch`) ![Android app step 1](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-8.3-roy56zpyc7m.webp&w=3840&q=75) ![Android app step 2](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-9.2pex8wr0-g9u0.webp&w=3840&q=75)
-   Download the `google-services.json` file ![Android app step 3](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-10.1kcn3h3gd5s0b.webp&w=3840&q=75)
-   Move it into your app-level `/` directory ![Android app config](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fanalytics-10-1.3bjjbktfj362r.webp&w=3840&q=75)

### You're ready to go!

That's it — your Firebase Analytics setup is complete.

Once connected, analytics events will be sent automatically, and you can start logging custom events using `firebaseAnalytics.logEvent(...)`.

## Resources

[

### Google analytics with Expo

docs.expo.dev/guides/using-analytics/



](https://docs.expo.dev/guides/using-analytics/)[

### React Native Firebase

rnfirebase.io/



](< https://rnfirebase.io/>)
