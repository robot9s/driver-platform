---
title: "Monitoring"
source: https://nativelaunch.dev/docs/monitoring
fetched: 2026-07-07
---

# Monitoring

NativeLaunch uses **Sentry** for error tracking and performance monitoring.

Sentry is a powerful tool that helps developers identify and resolve runtime issues by automatically capturing:

-   JavaScript errors and exceptions
-   Native crashes (on iOS/Android)
-   Performance bottlenecks
-   Stack traces and device metadata

### Create a Sentry account

Visit the [Sentry Dashboard](https://sentry.io/). Sign in or create a free account to get started.

### Create a new project

Go to your Sentry Dashboard.

-   In the Sentry Dashboard, click **New Project**
-   Select **React Native** as the platform
-   Copy your **DSN (Data Source Name)** for later use ![Sentry new projec](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsentry-1.3abj-w3b8eton.webp&w=3840&q=75)

### Update your .env.local file

Add the DSN and optionally other identifiers like project, organization, and Sentry URL to your `.env` file: ![Sentry env config](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsentry-2.0vhej3biun-90.webp&w=3840&q=75)

.env

```
EXPO_PUBLIC_SENTRY_DSN==*****
```

### Configure Sentry in app.json

Add the Sentry config under the `plugins` section in your `app.json` or `app.config.js`:

app.json

```
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "your-organization",
          "project": "your-project",
          "url": "https://sentry.io/"
        }
      ]
    ]
  }
}
```

This will configure Sentry automatically during the build using EAS.

### You're ready to go!

That's it! Now you can start monitoring your application's performance and errors. All errors and crashes will be automatically reported to Sentry.

## Resources

[

### Sentry Documentation

https://docs.sentry.io/

](https://docs.sentry.io/)[

### Using Sentry with Expo

https://docs.expo.dev/guides/using-sentry/

](https://docs.expo.dev/guides/using-sentry/)
