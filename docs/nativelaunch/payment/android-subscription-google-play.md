---
title: "Android Subscription – Google Play Configuration"
source: https://nativelaunch.dev/docs/payment/android-subscription-google-play
fetched: 2026-07-07
---

# Android Subscription – Google Play Configuration

> How to set up subscriptions in Google Play and integrate them via RevenueCat

Documentation may be outdated

RevenueCat and Google Play Console interfaces change frequently. The steps below may not reflect the latest UI. For the most up-to-date instructions, refer to the official RevenueCat documentation: [Google Platform Resources →](https://www.revenuecat.com/docs/platform-resources/google-platform-resources)

## Configuration Google Play

Setting up Android subscriptions using Google Play Console and RevenueCat. NativeLaunch comes with a preconfigured purchase flow with 1 subscription plan: `pro`.

## Google Play Developer Account

-   Make sure you have an active [Google Play Developer account](https://play.google.com/console/) ($25 one-time fee).
-   Your app must be fully set up in the Google Play Console:
    -   Uploaded `.aab` file
    -   App information completed
    -   Package name defined and consistent

## Create Subscriptions in Google Play

1.  Open [Google Play Console](https://play.google.com/console/)
2.  Select your app
3.  In the sidebar, go to **Monetize → Products → Subscriptions**
4.  Create a **subscription group** and add individual subscriptions: ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-1.2woensets7-le.webp&w=3840&q=75)

-   Identifier (e.g. `pro_monthly`) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-2.0839yun26dxsv.webp&w=3840&q=75)
-   Duration, price, description, icon ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-3.3v-0fddt7_3sr.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-4.2rmulq201b2uo.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-5.07suwc2orkeug.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-6.3z76i12jpwk44.webp&w=3840&q=75)
-   Make sure the subscription is **activated and saved**

> 🔶 The subscription must be fully configured and active, or RevenueCat will not detect it.

## Create a Service Account in Google Cloud

To allow RevenueCat to validate and sync subscriptions:

1.  Open [Google Cloud Console → IAM → Service Accounts](https://console.cloud.google.com/iam-admin/serviceaccounts) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-7.2ew3svedbnqdk.webp&w=3840&q=75)
2.  Select the same project linked with your Play Console
3.  Click **Create Service Account**
4.  Set a name (e.g. `revenuecat-service`) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-8.0uratc6flf831.webp&w=3840&q=75)
5.  Assign roles:
    -   `Viewer`
    -   `Play Developer` (from Google Play Android Developer API group) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-9.0qd8mfb6z6arm.webp&w=3840&q=75)
6.  Complete and create the service account

## Enable Required APIs in Google Cloud

In [Google Cloud Console → APIs & Services → Library](https://console.cloud.google.com/apis/library):

Enable the following APIs:

-   **Google Play Android Developer API**
-   **Cloud Pub/Sub API**
-   (Optional) **Cloud Logging API** if you want additional debugging capabilities

Make sure these APIs are enabled in the same Google Cloud project linked to your Play Console. ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-10.3np2kni9e4rhv.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-11.1_4cuj72ao2gm.webp&w=3840&q=75)

## Generate Service Account Key

1.  Open the service account you created
2.  Go to the **Keys** tab → **Add Key** → **Create new key**
3.  Choose `JSON` format
4.  Download the file — you’ll upload this in RevenueCat

![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-12.3uq-4ombmyrlb.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-13.0_1nxyftqlq07.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-14.2o43jdx679bz6.webp&w=3840&q=75)

## Invite and Link Service Account in Google Play Console

1.  Go to [Google Play Console → Users and Permissions](https://play.google.com/console/developers/users-permissions)
2.  Click **Invite new user**
3.  Paste the service account email (from Google Cloud)
4.  Assign the following permissions:
    -   `View financial data`
    -   `Manage orders and subscriptions`
5.  Send the invitation and accept it if needed (some accounts auto-accept)

> ✅ After inviting, the service account will appear under **API Access** as well. ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-15.2ngv6wqtutz2-.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-16.1l_fw20-mwjap.webp&w=3840&q=75)

6.  Go to [Google Play Console → API Access](https://play.google.com/console/developers/api-access)
7.  Link your Google Cloud project if not already linked
8.  Find your service account → click **Grant Access**
9.  Confirm the permissions listed above are applied ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-17.1cq6c9bqbjlq8.webp&w=3840&q=75)

## Add Your App to RevenueCat

1.  Go to [RevenueCat Dashboard](https://app.revenuecat.com/)
2.  Create a new project (or open an existing one)
3.  Under **Apps**, click **\+ Add Google Play App** ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-19.32fnlr3gi1s7x.webp&w=3840&q=75)
4.  Fill in:
    -   App name
    -   Package name (must match your Play Console)
    -   Upload your **JSON service account credentials**

> ⏱ RevenueCat may take a few minutes to validate your credentials.

**🧩 Tip:** If validation is stuck, follow [this trick from RevenueCat](https://www.revenuecat.com/docs/google-play/overview#subscription-setup-checklist):

-   Go back to the Google Play Console
-   Edit your subscription’s description slightly
-   Save the change — this triggers a refresh in RevenueCat ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-20.0v_3sitjvpp0z.webp&w=3840&q=75)

## Create Products

1.  In RevenueCat → **Products** → **Import from Google**
2.  Select your subscriptions (`pro_monthly`, etc.) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-21.2t08_yt1ovqp_.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-22.39j2vi8ut3r5b.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-23.2hp_aou5cl-jx.webp&w=3840&q=75)

## Create Entitlements

1.  Create **Entitlements** like `pro` ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-24.3awocnlupovkf.webp&w=3840&q=75)
2.  Link subscriptions to their respective entitlements ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-25.2pw4jbu5mtynt.webp&w=3840&q=75)

## Set Up Offerings

1.  Go to **Offerings** → create an offering (e.g. `default`) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-26.3hr8fg510wz5y.webp&w=3840&q=75)
2.  Add packages inside the offering (monthly, annual, etc.) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-27.2dk0t8yo6fzxn.webp&w=3840&q=75)
3.  Use `useOfferings` in your custom UI to show available plans:

```
const offerings = useOfferings()
const subscribe = useSubscribeMutation()

function handlePurchase(plan: PurchasesPackage) {
  subscribe.mutateAsync({ offer: plan })
}
```

## Generating an API Key

RevenueCat uses a server key to sync with Google Play:

1.  In [Google Play Console → API Access](https://play.google.com/console/developers/api-access), scroll to **API Keys**
2.  Click **Create New Key**
3.  Name the key (e.g. `revenuecat-api-key`) and click **Create**
4.  Copy the generated key and add it to your environment variables:

```
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=your_key_here
```

![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgoogle-28.43j96klxpqhjk.webp&w=3840&q=75)

## Custom Paywall (Optional)

NativeLaunch uses a **custom implementation** of the paywall screen. If you use your own design, skip RevenueCat's visual paywall editor.

Fetch product offerings using:

```
import { useOfferings } from 'react-native-purchases'

const { current, loading } = useOfferings()
```

* * *

## ✅ Troubleshooting

-   Subscriptions not showing up?
    
    -   Check that they are active and approved in Google Play Console
    -   Confirm your JSON credentials are correct
    -   Ensure the service account has API access and proper permissions
    -   Enable required APIs in Google Cloud
    -   Look at **RevenueCat → Overview → Debug Logs** for real-time info

* * *

## Resources

[

### Expo + RevenueCat Integration

Learn how to integrate RevenueCat with your Expo or React Native app.



](https://www.revenuecat.com/docs/getting-started/installation/expo)[

### RevenueCat: Google Play Setup

Official RevenueCat guide for Google Play



](https://www.revenuecat.com/docs/getting-started/entitlements/android-products)
