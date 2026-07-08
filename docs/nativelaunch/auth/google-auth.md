---
title: "Google Authentication"
source: https://nativelaunch.dev/docs/auth/google-auth
fetched: 2026-07-07
---

# Google Authentication

This tutorial will guide you through configuring **Google Authentication** with Supabase in your Expo project. It covers everything in detail: OAuth Consent Screen, Client IDs for Web/Android/iOS, Supabase provider setup, and app integration.

* * *

Before you begin, ensure you have a [Google Cloud account](https://console.cloud.google.com).

## 1\. Google Developer Setup

### Configure the OAuth Consent Screen

1.  Create a New Project:

-   Go to the [Google Cloud Console](https://console.cloud.google.com/).
-   Click on the project dropdown in the top left corner and select “New Project.”
-   Give your project a name and click **Create**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-1.3fxgk5o4h5ehz.webp&w=3840&q=75)

3.  Set Up OAuth Consent Screen:

-   Navigate to [APIs & Services → OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent). ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-2_1.2f15paatu64sj.webp&w=3840&q=75)

5.  Fill in App Information:

-   **App name:** Enter your app's name. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-3.1pli1ihcvjo4m.webp&w=3840&q=75)
-   **User support email:** Enter a contact email.
-   **App logo:** (Optional) Upload your app's logo.
-   **App domain:** If you own a domain, enter it here.
-   **Authorized domains:** Add your production domain(s) and your Supabase project domain (e.g., _PROJECT\_ID_.supabase.co, you can find it in Supabase Dashboard → Project Settings → API)
-   **Developer contact information:** Enter your email address. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-4.2u6c6mim2s5ba.webp&w=3840&q=75)
-   Click "Save and Continue."

7.  Open the **Audience** tab in your Google Cloud project (OAuth consent screen settings).

-   Confirm that **User type** is set to **External** (default for most projects). ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-2_2.43jjhi2bfviri.webp&w=3840&q=75)
-   Check the **Publishing status**: by default it is _Testing_. For production, click **Publish app**.
-   If the app remains in _Testing_, add your Google accounts under **Test users**.

9.  Scopes:

-   Click "Add or Remove Scopes" and add the required scopes for your app. For basic Google authentication, you’ll need openid, email, and profile.
-   Click "Save and Continue."

### Create OAuth 2.0 Client IDs

Important

You must create a **Web Client** (required for Supabase). Even if you only target Android/iOS, Supabase uses the Web Client ID + Secret to complete the OAuth flow. In addition, you create Android and iOS clients so that Google recognizes your mobile apps and allows token issuance. The Web Client ID and Secret are always required — the Android/iOS Client IDs are also needed but only entered in Supabase, not directly in your Expo code.

#### 1\. Web Client (required for Supabase OAuth)

1.  Go to **APIs & Services → Credentials**.
2.  Click **Create Credentials → OAuth Client ID**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-5.37avd5_aoj7nv.webp&w=3840&q=75)
3.  Select **Web Application**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-6-web.2nmckduj_od0z.webp&w=3840&q=75)
4.  Name the client (e.g., “Expo Web Client”).
5.  Add Authorized redirect URIs: Copy the Callback URL directly from your Supabase dashboard (e.g. `https://<project-ref>.supabase.co/auth/v1/callback`)
6.  Click **Create**.
7.  Save the Client ID and Client Secret — you’ll need them for Supabase.

#### 2\. Android Client (for Google Cloud / Supabase only)

1.  Click **Create Credentials → OAuth Client ID**.
2.  Select **Android**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-6-android.38peardgyq_h_.webp&w=3840&q=75)
3.  Name it (e.g., “Expo Android Client”).
4.  Enter your Android package name (e.g., `com.nativelaunch.app`).
5.  Add SHA-1 fingerprints:

Recommendation

Create two clients: one for **development**, one for **production**.

Here is an example of how I did it on my application: ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-6_1-android.05qub9dd0o4f4.webp&w=3840&q=75)

**Development SHA-1:** Run:

```
keytool -list -v -keystore ./android/app/debug.keystore \
-alias androiddebugkey \
-storepass android -keypass android
```

**Production SHA-1:** In Play Console → **Setup → App Integrity** → **App signing certificate**.

![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-7.37-69exdhog7e.webp&w=3840&q=75)

7.  Click **Create** and save the Client ID.
8.  **Note:** You do not use the Android Client ID directly in your Expo app. Instead, add it to Supabase along with the iOS Client ID.

#### 3\. iOS Client

1.  Click **Create Credentials → OAuth Client ID**.
2.  Select **iOS**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-6-ios.0_45y6greo_u9.webp&w=3840&q=75)
3.  Name it (e.g., “Expo iOS Client”).
4.  Enter your iOS bundle identifier (e.g., `com.nativelaunch.app`).
5.  Click **Create**.
6.  After creation, open the client and copy the **iOS URL Scheme** (REVERSED\_CLIENT\_ID).
7.  **Note:** The iOS Client ID is required both in your Expo code (iosClientId) and in Supabase (comma-separated with the others).

### Update .env

.env

```
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=*****
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=*****
```

You only set the Web Client ID (and iOS Client ID if needed) in your Expo app. Android Client ID is handled by Supabase and does not go into your code.

### Get iOS URL Scheme

In your Google Cloud project, navigate to APIs & Services > Credentials. Click on the iOS OAuth Client you created. Copy the iOS URL Scheme.

Update the values in your app.json file:

app.config.js

```
export default {
  expo: {
    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.googleusercontent.apps.xxxxxxxx"
        }
      ]
    ]
  }
}
```

* * *

## 2\. Supabase Setup

### Enable Google Provider

-   Open your [Supabase Dashboard](https://supabase.com/).
-   Go to **Authentication → Providers**.
-   Enable **Google**. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-1.2sosmytu41jo0.webp&w=3840&q=75)
-   Paste all your Client IDs (Web, Android, iOS) comma-separated, and the **Client Secret** from the Web client. ![google auth](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-2.14eamzi-utb2n.webp&w=3840&q=75)

### Redirect URLs

-   Supabase shows you the correct **Callback URL** (e.g. `https://<project-ref>.supabase.co/auth/v1/callback`).
-   Copy this and add it to your Google Cloud Web Client under **Authorized redirect URIs**.

### Test Your Setup

Run Your App on a Simulator or Device:

-   If you're using a simulator, make sure it supports iOS 13 or later (required for Sign In with Apple).
    
-   If you have a device, you can test the authentication flow more accurately.

* * *

## Resources

[

### Supabase Docs: Sign in with Google

supabase.com



](https://supabase.com/docs/guides/auth/social-login/auth-google)[

### Expo AppleAuthentication

docs.expo.dev



](https://docs.expo.dev/guides/google-authentication/)[

### @react-native-google-signin/google-signin

github.com



](https://github.com/react-native-google-signin/google-signin)
