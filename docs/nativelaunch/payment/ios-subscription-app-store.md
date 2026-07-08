---
title: "iOS Subscription – App Store Connect Configuration"
source: https://nativelaunch.dev/docs/payment/ios-subscription-app-store
fetched: 2026-07-07
---

# iOS Subscription – App Store Connect Configuration

> Setting up In‑App subscriptions for your project using RevenueCat

Documentation may be outdated

RevenueCat and App Store Connect interfaces change frequently. The steps below may not reflect the latest UI. For the most up-to-date instructions, refer to the official RevenueCat documentation: [Apple Platform Resources →](https://www.revenuecat.com/docs/platform-resources/apple-platform-resources)

## Configuration App Store Connect

NativeLaunch comes with a preconfigured purchase flow with 1 subscription plan: `pro`.

## Apple Developer Account

-   Log in to your [Apple Developer account](https://developer.apple.com/account/).
-   Ensure you've created your app in App Store Connect.

## Create Subscriptions in App Store Connect

In App Store Connect:

1.  Select your newly created app.
2.  Go to **In-App Subscriptions** in the left sidebar. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-1.2iuthhdwt_2h7.webp&w=3840&q=75)
3.  Create a **Subscription Group**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-2.1_r5j34g4csp9.webp&w=3840&q=75)
4.  Inside the group, create subscriptions (e.g. `pro_monthly`, etc.). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-3.1oz4lra1cvnl3.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-4.3y6q5nj60kkyt.webp&w=3840&q=75)
5.  Fill out required details (name, pricing, duration). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-5.1jy0lnqprtwsc.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-6.38l8yfl__lf0s.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-7.35piev_iky8os.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-8.3mppvkrid4orx.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-9.3udanux2vwmnb.webp&w=3840&q=75)
6.  If you change identifiers later, update them in RevenueCat too.

### 

## Generate App-Specific Shared Secret

1.  Go to your app's **App Information** section.
2.  Scroll down to **App-Specific Shared Secret**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-10.0rihetqbj2x-e.webp&w=3840&q=75)
3.  Click **Manage** → **Generate**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-11.24ombo-3bjv-3.webp&w=3840&q=75)
4.  Copy the key and store it securely — you'll need it for RevenueCat. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-12.0c7jfn6qucm9c.webp&w=3840&q=75)

## Generate In-App Purchase Key

To allow RevenueCat to communicate with StoreKit:

1.  In App Store Connect, go to **Users and Access** (top menu).
2.  Go to **Integrations** → **In-App Purchase**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-13.0t15koyl_swft.webp&w=3840&q=75)
3.  Generate a new Key. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-14.2h-27j4ny0j3-.webp&w=3840&q=75)
4.  Copy the Key ID and Issuer ID (visible above keys). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-15.10g_r2u3gn_lm.webp&w=3840&q=75)
5.  If needed, generate App Store Connect API key — ensure you note Issuer ID.
6.  Download the `.p8` file and store it securely. You’ll also see your **Key ID** and **Issuer ID**.

## Generate App Store Connect API Key

To allow RevenueCat to communicate with StoreKit:

1.  Go to **Users and Access** → **Keys** tab (not In-App Purchase tab).
2.  Click **Generate API Key**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-16.1enk2dyq-6l72.webp&w=3840&q=75)
3.  Enter a name, select **App Manager** role. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpayment-17.0lgwwijbo83ww.webp&w=3840&q=75)
4.  Copy the generated **Issuer ID**, **Key ID**, and download the `.p8` key file.
5.  Save all three values securely.

## Add App Store App in RevenueCat

1.  In RevenueCat, create a new project.
2.  Go to **Apps** → **Add App Store App**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-16.2fdh_-7q690e2.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-17.1umxpnpdbk_1o.webp&w=3840&q=75)
3.  Fill in:

-   App name
-   Bundle ID (must match App Store Connect)
-   Shared Secret
-   Key ID
-   Issuer ID ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-18.3bynoadneoiq9.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-19.3lgbdfy9jx7y-.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-20.20i9crhbbfyg5.webp&w=3840&q=75)

## Generate RevenueCat API Key

1.  Go to **API Keys** section in RevenueCat.
2.  Click **Show API Key** next to your app. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-21.1cw1-s3lakx8h.webp&w=3840&q=75)
3.  Copy the key securely for `.env`.

```
// .env
EXPO_PUBLIC_REVENUECAT_API_KEY_IOS=your_revenuecat_api_key
```

## Import Products to RevenueCat

1.  Go to **Products** → click **\+ New**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-22.09o0gi4cd-qdh.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-23.0e1nkboy-djqs.webp&w=3840&q=75)
2.  Use **Import Products** → select your App Store app. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-24.40a7kad5pe5wk.webp&w=3840&q=75)
3.  The imported products (`pro_monthly`, etc.) will appear. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-25.0lmu67lusuazq.webp&w=3840&q=75)

## Create Entitlement

1.  Navigate to **Entitlements** → click **\+ Create**. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-26.2i01n5nxtha_x.webp&w=3840&q=75)
2.  Add entitlement ID (e.g. `pro`). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-27.1alh-f1v57qxo.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-28.41a9e-69i-zpz.webp&w=3840&q=75)
3.  Attach the corresponding products. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-29.1mi73v9olr-rj.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-30.0clr1c6djselt.webp&w=3840&q=75)

## Create Offering and Packages

1.  Go to **Offerings** → click **\+ Add Offering** (identifier: `default`). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-31.1pz86quhbv4hv.webp&w=3840&q=75)
2.  Add packages (monthly, annual, etc.). ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-32.3zp8z71162sgp.webp&w=3840&q=75) ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-33.3ktdsuicow0lr.webp&w=3840&q=75)
3.  Save your offering. ![ios subscription](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FrevenueCat-34.41ud6ti1odc4o.webp&w=3840&q=75)

## Custom Paywall Implementation

Instead of using the built-in RevenueCat paywall editor, NativeLaunch uses a custom React Native implementation.

If you’re building your own paywall UI, skip this step and use the useOfferings() hook to fetch available products and entitlements from RevenueCat. You can handle purchasing via react-native-purchases.

```
import {useOfferings} from 'react-native-purchases'

const {current, loading} = useOfferings()
```

You can see a full working example in PaywallScreen.tsx of the template.

## ✅ Troubleshooting

-   If products or offerings don’t appear, check for pending agreements in App Store Connect.
-   Ensure you’ve copied the correct Shared Secret, API Key ID, and Issuer ID.
-   Verify that Bundle ID is identical in App Store Connect and RevenueCat.

* * *

[

### Helpful Resources

RevenueCat Documentation – Full guide on configuring in-app subscriptions with App Store.



](https://www.revenuecat.com/docs/getting-started/entitlements/ios-products)[

### Expo + RevenueCat Integration

Learn how to integrate RevenueCat with your Expo or React Native app.



](https://www.revenuecat.com/docs/getting-started/installation/expo)
