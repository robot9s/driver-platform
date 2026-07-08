---
title: "Login with Email"
source: https://nativelaunch.dev/docs/auth/login-with-email
fetched: 2026-07-07
---

# Login with Email

Magic Link login provides a simple and secure way to authenticate users without passwords. Users only need to enter their email, receive a link, and follow it to log in.

1.  User enters their email in the app
2.  Supabase sends a login email with a magic link or verification code
3.  User enters the code and is automatically signed in

Email authentication is usually enabled by default when creating a new Supabase project.

* * *

## Supabase Setup

### Enable Email Provider

-   Go to your [Supabase Dashboard](https://supabase.com/)
-   Navigate to **Authentication → Providers**
-   Ensure that the **Email** provider is enabled (enabled by default in most cases) ![supabase login with email](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Femail-supabase-1.05gzs9mq_c-pg.webp&w=3840&q=75)
-   It’s recommended to enable **Confirm email** to require email verification on first login ![supabase login with email](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Femail-supabase-2.13uy656ge3aqh.webp&w=3840&q=75)

### Customize Email Templates

By default, Supabase sends a **magic link** for login. If you’re building a mobile app with Expo, it’s often better to use a **confirmation code** instead — which users enter manually.

To enable this flow:

-   Go to **Authentication → Emails**
    
-   Open the **Confirm Signup** and **Magic Link** tab
    
-   Edit the email content to show only the **confirmation code** (`{{ .Token }}`) and remove the default link
    
    ```
    <h2>Welcome to NativeLaunch</h2>
    
    <p>Use this 6-digit code to confirm your email:</p>
    <h1>{{ .Token }}</h1>
    <p>If you did not request this, you can ignore this email.</p>
    
    <p>Thanks,<br/> The NativeLaunch Team</p>
    ```
    
-   Optionally, adjust subject and styles ![supabase login with email](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Femail-supabase-3.0q7l8c0o88m91.webp&w=3840&q=75) ![supabase login with email](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Femail-supabase-4.2m3ydginw270u.webp&w=3840&q=75)
    

### Test the Flow

-   Run your app on a simulator or physical device
-   Enter an email in the login form
-   Check if the email arrives and verify the code works correctly

* * *

## Notes

-   You can adjust the OTP expiration time in Supabase authentication settings
-   For production, it’s strongly recommended to set up a custom SMTP server

* * *

## Resources

[

### Supabase Email Auth Docs

supabase.com



](https://supabase.com/docs/guides/auth/email)[

### SMTP Setup (Supabase)

supabase.com



](https://supabase.com/docs/guides/auth/auth-email#configuring-smtp)
