---
title: "Release Strategy"
source: https://nativelaunch.dev/docs/release-strategy
fetched: 2026-07-07
---

# Release Strategy

This page explains our practical approach to environments, builds, and releases. It reflects real-world constraints (cost, control, simplicity) rather than a “one-size-fits-all” recipe. Use what works for you.

## Diagram: end-to-end release flow

![Release strategy diagram showing how commits go through GitHub Actions, EAS local build, and finally App Store/Google Play before merging to prod](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Frelease-strategy.18ufc_wdu_86p.webp&w=3840&q=75)

The diagram shows the full release pipeline:

1.  Commit to `main` with a conventional message → → `release-please` auto-creates a PR.
2.  GitHub Actions manually triggered → runs **EAS local build**.
3.  iOS & Android binaries are built and submitted to the App Store / Google Play.
4.  Testing happens in **TestFlight (iOS)** or **Internal Track (Google Play)**.
5.  After successful testing, we **publish the app to production** in the App Store / Google Play.
6.  **Only after the app is published** do we merge the release PR into `prod`.
7.  Final version tag is created only after a successful store release.

## Quick summary

-   **One source of truth** → all env vars live in GitHub Environments (`preview`, `production`). [See setup guide →](../docs/github-environments)
    
-   **Versioning** → `release-please` based on conventional commits; release PR merged **only after store publication**. [See release setup →](../docs/release-app)
    
-   **One pipeline** → GitHub Actions runs `eas build --local` and (optionally) submits to TestFlight / Play. [See workflow example →](../docs/submit-ios-app-store)
    
-   **Profiles & targets** → same workflow supports `preview|production` × `ios|android`.
    
    Why not EAS Cloud?
    
    Free tiers are limited, and in practice we usually need a paid **GitHub** plan anyway. Paying for both GitHub and EAS Cloud is unnecessary for our workflow. Running `eas build --local` inside GitHub Actions gives us full control.
    
    Not a universal recipe
    
    This is simply **our approach**. If EAS Cloud (or another pipeline) works better for your team, use it. The goal here is to show an opinionated setup that prioritizes cost, control, and simplicity.
    

* * *

## Resources

[

### Release Please

github.com/googleapis/release-please



](https://github.com/googleapis/release-please)[

### GitHub Actions

github.com/features/actions



](https://github.com/features/actions)
