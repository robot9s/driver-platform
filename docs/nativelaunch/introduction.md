---
title: "Introduction"
source: https://nativelaunch.dev/docs
fetched: 2026-07-07
---

# Introduction

Welcome to the **NativeLaunch** documentation. This is your starting point for learning about the starter kit, its structure, features, and how to use it for your app development.

![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpreview.3fo4vh_62z954.webp&w=3840&q=75)

* * *

Documentation scope

This documentation covers the **single-app NativeLaunch starter**. The **NativeLaunch Monorepo starter** follows the same structure and setup — the docs here apply to both.

## What is NativeLaunch?

**NativeLaunch** is a blazing-fast and fully extensible Expo template that helps you build beautiful, production-ready React Native apps — from MVPs to polished SaaS products. Whether you're launching a side project, building a mobile-first business, or experimenting with new ideas, NativeLaunch helps you move faster.

* * *

### What You Get

NativeLaunch is more than a boilerplate — it's a complete **demo application** you can run, explore, and extend.

You'll get a fully functional **Notes App** that includes:

-   ✅ Onboarding flow with animated slides
-   ✅ Google, Apple, and Magic Link authentication via Supabase
-   ✅ Notes list, detail, and edit screens. Notes and images stored in Supabase
-   ✅ Persistent local storage (MMKV)
-   ✅ Seamless navigation with `expo-router`
-   ✅ Dark mode support
-   ✅ Clean TypeScript-first codebase
-   ✅ Beautiful UI built with UniWind and HeroUI Native
-   ✅ Smooth UI transitions powered by Reanimated
-   ✅ In-app subscriptions via RevenueCat and StoreKit
-   ✅ Analytics integrations (Amplitude, PostHog, etc.)
-   ✅ Monitoring with tools like Sentry
-   ✅ Internationalization using JSON translation files

**Pro additions (Moneyra):**

-   ✅ Moneyra full app source — complete production project **(only for Pro)**
-   ✅ Local-first data layer (WatermelonDB) — offline sync **(only for Pro)**
-   ✅ Cloud backups (iCloud) **(only for Pro)**
-   ✅ No account required — works locally with default data **(only for Pro)**

📱 Live preview of the Notes App demo / Moneyra

### Who It’s For

NativeLaunch is perfect for:

-   Indie makers and solo developers
-   Startups validating MVPs
-   Teams who want a clean Expo foundation
-   Creators building mobile-first SaaS apps

* * *

## Getting Started

[

### Installation

How to install and run the template locally

](./setup/installation.md)[

### Configuration

What you need before starting with NativeLaunch

](./setup/configuration.md)[

### Project Structure

Understand the folder layout and its purpose

](./setup/project-structure.md)[

### AGENTS.md Guide

Understand what AGENTS.md is and how to use it when working with coding agents

](./agents.md)[

### Manage Dependencies

How to manage and update dependencies cleanly

](./setup/manage-dependencies.md)

* * *

## Features

[

### Google Authentication

Set up secure sign-in with Google using Supabase OAuth integration

](./auth/google-auth.md)[

### Apple Authentication

Enable Sign in with Apple for a seamless iOS login experience

](./auth/apple-auth.md)[

### Supabase

Database, auth, and storage integration

](./supabase/setup.md)[

### Payments

Subscriptions via RevenueCat and StoreKit

](./payment/overview.md)[

### Analytics

Integrations with Amplitude, PostHog, etc.

](./analytics/overview.md)[

### Monitoring

Track errors and performance (e.g. Sentry)

](./monitoring.md)[

### AI Assistant (Notes)

Built-in OpenAI integration example for note creation, summarization, and assistant-style flows

](./ai/overview.md)[

### Push Notifications

Send push notifications using OneSignal

](./notifications/overview.md)

* * *

## Appearance

[

### Theme

Change theme, fonts, colors, and styles

](./customization/styling.md)[

### Internationalization

Add multilingual support using JSON files

](./internationalization.md)

* * *

## Deployment

[

### Deploy via EAS

Use Expo Application Services to publish your app

](./environments/overview.md)[

### Submit to App Store

Prepare and upload to Apple’s App Store

](./build-and-submit/submit-ios-app-store.md)[

### Submit to Google Play

Generate and upload builds to Google Play

](./build-and-submit/submit-android-google-play.md)
