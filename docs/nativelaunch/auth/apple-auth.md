---
title: "Apple Authentication"
source: https://nativelaunch.dev/docs/auth/apple-auth
fetched: 2026-07-07
---

# Apple Authentication

To use Apple sign in, you need a client ID and client secret. You can get them from the Apple Developer Portal. You will need an active Apple Developer account to access the developer portal and generate these credentials. Follow these steps to set up your App ID, Service ID, and generate the key needed for your client secret:

* * *

## 1\. Apple Developer Setup

### Log in to Apple Developer

Go to the [Apple Developer Portal](https://developer.apple.com/account/) and sign in with your Apple Developer credentials.

### Create an App ID

-   Go to **Certificates, Identifiers & Profiles → Identifiers**.
-   Go to the Identifiers tab. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F1-certificates.3uzki0pjnry59.webp&w=3840&q=75)
-   Click the + icon next to Identifiers.
-   Select App IDs, then click Continue. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F2-certificates.31mx5im__41u4.webp&w=3840&q=75)
-   Select App as the type, then click Continue. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F3-certificates.3qwbq20vm29kz.webp&w=3840&q=75)
-   Description: Enter a name for your app (e.g., "My Awesome App"). This name may be displayed to users when they sign in. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F4-certificates.3rj6_fvcb2frm.webp&w=3840&q=75)
    
-   Bundle ID: Set a bundle ID. The recommended format is a reverse domain name (e.g., com.yourcompany.yourapp). Using a suffix like .ai (for app identifier) can help with organization but is not required (e.g., com.yourcompany.yourapp.ai).
    
-   Scroll down to **Capabilities**, enable **Sign in with Apple**, then click **Continue** → **Register**. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F5-certificates.0b5xty-eq8w2k.webp&w=3840&q=75)

### Create a Service ID (Client ID):

-   Go to "Identifiers" in the Apple Developer Portal. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F6-service.1o5yzfrboq7bf.webp&w=3840&q=75)
-   Register a new identifier for Service IDs ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F7-service.3p5mtkflem8c9.webp&w=3840&q=75)
-   Click Continue, then Save.
-   Find the Service ID you just created in the Identifiers list and click on it. Check the Sign In with Apple capability, then click Configure. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F8-service.1tmc6lup7acxl.webp&w=3840&q=75)
    

### Create a Key (download .p8 file)

-   Go to **Certificates, Identifiers & Profiles → Keys**.
-   Click the + icon to create a new key. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F9-key.02lrbk4jmdfoj.webp&w=3840&q=75)
-   Enable **Sign in with Apple**, then click **Continue** → **Register**. ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F10-key.0xgdhvescpe30.webp&w=3840&q=75) ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F11-key.39_ftrw28ygjg.webp&w=3840&q=75)
-   Download the file `AuthKey_XXXXXXXXXX.p8` (Apple only allows one-time download). ![apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F12-key.43qw4p9m_udlj.webp&w=3840&q=75)
-   Note your **Key ID** (from the portal) and **Team ID** (from your Apple Developer account).

### Generate Client Secret (for OAuth flow)

-   Open [applekeygen.expo.app](https://applekeygen.expo.app/). ![supabase apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F13-generator.41bdabyf26gcy.webp&w=3840&q=75)
-   Fill in the required fields:
    
    -   **Team ID** (from Apple Developer)
    -   **Key ID** (from the key you created)
    -   **Client ID** = your **Service ID** (e.g. `com.nativelaunch.app.web`)
    -   **Private Key** = contents of `AuthKey_XXXXXXXXXX.p8`
-   Click **Generate** → you will get a **client\_secret** (JWT).
-   Copy this secret into Supabase → **Authentication → Providers → Apple → Secret**.

Client secrets expire every 6 months — you must regenerate them before they expire.

* * *

## 2\. Supabase Setup

### Enable Apple Provider in Supabase

-   Go to your [Supabase Dashboard](https://supabase.com/)
-   Navigate to **Authentication → Providers**
-   Enable the **Apple** provider ![supabase apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F14-supabase-apple.3xu1qs7wx16jn.webp&w=3840&q=75)

### Configure Apple Provider

-   **Client ID**: your **Service ID** (e.g. `com.nativelaunch.app.web`)
-   **Client Secret**: paste the generated **JWT** (from applekeygen.expo.app) ![supabase apple auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2F15-supabase-apple.0py1g1s1ma11g.webp&w=3840&q=75)
-   Save changes.

* * *

## Resources

[

### Expo AppleAuthentication

docs.expo.dev



](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)[

### Sign in with Apple (Apple)

developer.apple.com



](https://developer.apple.com/sign-in-with-apple/)[

### Supabase Apple Auth Guide

supabase.com



](https://supabase.com/docs/guides/auth/social-login/auth-apple)
