---
title: "Setup"
source: https://nativelaunch.dev/docs/supabase/setup
fetched: 2026-07-07
---

# Setup

Supabase serves as the backbone of NativeLaunch’s backend infrastructure. As an open-source alternative to Firebase, it provides a complete suite of backend services through a unified API. These services include a PostgreSQL database for data management, authentication systems for user access, real-time subscriptions for live updates and storage capabilities for media handling. ![supabase expo](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fexpo-supabase.3dqbw8dvnp4zv.webp&w=3840&q=75)

## Understanding Supabase Integration

In our application architecture, Supabase manages several essential features. The authentication system supports multiple sign-in methods including Apple authentication, Google authentication and passwordless email authentication through Magic Links. Our PostgreSQL database handles all user-related data storage needs from basic profile information to user-submitted feedback. The platform’s S3-compatible storage system takes care of profile images and other media assets your application might need.

## Setting Up Your Environment

Setting up Supabase involves two main steps: creating your project space and connecting it to your application. Let’s walk through this process.

### Creating Your Supabase Project

Begin by creating your project environment. Head to Supabase and sign in to your account. From your dashboard, locate and click the “New Project” button. You’ll need to provide some basic information:

Select or create an organization for your project:

-   Choose a name for your project
-   Set a database password
-   Select a region closest to your users
-   After entering these details, click “Create new project.” Supabase will handle the initialization process and set up your database, API and authentication systems.

### Configuring API Credentials

Once your project initializes, you’ll need to set up your API credentials:

1.  Navigate to your project settings through the dashboard at [https://supabase.com/dashboard/project/](https://supabase.com/dashboard/project/)
2.  Look for your project URL and anon/public key
3.  Add these details to your application’s environment: ![supabase setup](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-setup.0wrwh3varf3x7.webp&w=3840&q=75) ![supabase setup](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-setup-2.28p9hggmjvg57.webp&w=3840&q=75)

Open your .env file and add the following variables:

```
  EXPO_PUBLIC_SUPABASE_PROJECT_URL=https://example.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## What’s Next?

Now that your Supabase environment is ready and connected, you're all set to:

-   Configure **Authentication** providers (e.g., Apple, Google, Magic Link)
-   Set up your **Database** schema for users, notes, plans, and more

Recommendation

The fastest way to get started is with **Magic Link** email authentication — it works out of the box with no platform configuration required.
