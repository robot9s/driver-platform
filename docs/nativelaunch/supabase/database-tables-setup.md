---
title: "Database Tables & Storage Setup"
source: https://nativelaunch.dev/docs/supabase/database-tables-setup
fetched: 2026-07-07
---

# Database Tables & Storage Setup

Setting up your database and storage is essential for getting started with NativeLaunch. This guide explains how to configure your Supabase project using ready-to-apply migrations — so you don’t have to manually recreate tables, buckets, or SQL policies.

## How It Works

NativeLaunch uses **Supabase** as the backend. Instead of writing SQL or configuring Storage manually in the dashboard, you apply a set of predefined migrations included in the template.

These migrations automatically create and configure everything required by the app:

-   Database tables and relations
-   Row Level Security (RLS) policies
-   Auth triggers
-   Storage buckets for user-generated files

All schema changes are applied in a single step using the Supabase CLI.

NativeLaunch includes pre-built profile and notes features that rely on this setup to work out of the box.

* * *

## What Gets Created

After applying the migrations, your Supabase project will include:

### Database tables

-   `auth.users` — managed by Supabase Auth
-   `profiles` — linked to `auth.users`, automatically created on sign-up
-   `notes` — demo table used by the Notes feature

### Storage buckets

-   `avatars` — public bucket for user profile images
-   `notes-images` — private bucket for note attachments (user-scoped)

### Security & automation

-   Row Level Security (RLS) policies for all user data
-   Storage access rules to ensure users can only access their own files
-   `on_auth_user_created` trigger to automatically create a profile record

You don’t need to manually configure any of this.

* * *

## Use Supabase Migrations

1.  **Install Supabase CLI**

```
brew install supabase/tap/supabase
```

After installation, verify it:

```
supabase --version
```

You can also run Supabase CLI without installing it globally:

```
npx supabase@latest --help
```

Useful for quick commands like `supabase init` or `supabase db push`.

2.  **Login to Supabase**

```
supabase login
```

3.  **Link your Supabase project**

Go to your Supabase Dashboard, find your project, and copy the `Project ID` (ref).

```
supabase link --project-ref your-project-id
```

Supabase CLI will prompt you for your **database password**.  
You can find it in _Project Settings → Database → Connection string_.

4.  **Apply the migrations**

From the root of the NativeLaunch repository, run:

```
supabase db push
```

This single command applies all database migrations and creates the required tables, storage buckets, policies, and triggers automatically.

In earlier versions of NativeLaunch, some setup steps (like auth triggers or storage) were done manually. These are now fully handled by migrations — no dashboard configuration required.

![supabase tables](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-tables.3q4ntuvbkaoum.webp&w=3840&q=75) ![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-storage.3si22zxu3u2hj.webp&w=3840&q=75)

* * *

## Notes on Storage Buckets

-   The `avatars` bucket is public and used for profile images.
-   The `notes-images` bucket is private and scoped per user.
-   Access is enforced via storage policies — users can only read or write their own files.

You do not need to create or configure buckets manually in the Supabase dashboard.

* * *

## Learn More

[

### Supabase CLI Docs

Official documentation for Supabase CLI and migrations

](https://supabase.com/docs/guides/cli)[

### Supabase Storage

Learn how Supabase Storage works under the hood

](https://supabase.com/docs/guides/storage)
