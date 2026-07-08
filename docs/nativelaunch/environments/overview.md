---
title: "Overview"
source: https://nativelaunch.dev/docs/environments/overview
fetched: 2026-07-07
---

# Overview

This template already ships with a **working `eas.json`** — you don’t need to configure it from scratch. It includes three profiles:

-   **development** → for testing with a dev client
-   **preview** → optional, for QA or internal builds
-   **production** → the main profile for testing and release

In practice, I only use **`production`** for both testing and releasing. For small projects, maintaining multiple environments (preview, staging, QA) usually adds complexity without much benefit. If you do need them, you can extend the configuration easily.

If you decide to add more environments (e.g. `staging`), the setup will depend on your release path:

-   **EAS Cloud** → link each `eas.json` profile with a GitHub Environment.
-   **EAS Local** → make sure the GitHub workflow runs the right profile.

## Deployment & environments

When working with multiple environments, you need to decide **how to deploy**. This template already provides **two GitHub Actions** to match both paths:

1.  **EAS Cloud Build & Submit** — builds in Expo Cloud, with optional auto-submit to stores.
    
    -   **Where to keep variables:** Secrets stored in **GitHub Environments** (API keys, signing info). Public runtime values via `EXPO_PUBLIC_*` in `app.config.ts`.
    -   **Best for**: teams that want managed infra, quick setup, and auto-submit.
2.  **EAS Local Build (Runner)** — builds on a GitHub runner (or self-hosted), then submits with `eas submit` or manually.
    
    -   **Where to keep variables:** Same GitHub Environments for secrets. Additional setup for signing (keystore, App Store Connect API key) managed directly in your workflow.
    -   **Best for**: teams that need full control, custom native steps, or want to avoid Expo Cloud limits.

Profiles (`preview`, `production`) are consistent across both workflows, so you can switch between Cloud and Local without changing your setup.

## Which one should I use?

| Criterion | **EAS Cloud** | **EAS Local (Runner)** |
| --- | --- | --- |
| Setup speed | Fastest (Expo manages build infra) | Medium (Xcode/Android SDK on runner) |
| Cost | Free tier with limits; paid tiers available | GitHub minutes & macOS runners can be costly; self-hosted = fixed cost/ops |
| Reliability | Stable managed infra | You own the machine; reliable if maintained |
| Performance | Good/consistent | Depends on runner size & cache |
| Credentials | Managed with EAS | You manage more pieces (keystore, Xcode toolchain) |
| Auto Submit | Yes (`eas submit`) | Yes (via `eas submit`) or manual (Transporter/Play Console) |
| Best for | Teams wanting **zero ops**, quick CI | Teams needing **full control**, custom toolchains, caching, or no Expo limits |

* * *

## Resources

[

### Expo Environment Variables

How to set up runtime and build-time variables with EXPO\_PUBLIC\_\*.

](https://docs.expo.dev/guides/environment-variables/)[

### GitHub Environments

How to securely store secrets for preview and production builds.

](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
