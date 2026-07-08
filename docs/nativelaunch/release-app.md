---
title: "Versioning & Changelog"
source: https://nativelaunch.dev/docs/release-app
fetched: 2026-07-07
---

# Versioning & Changelog

To automatically create new versions of your app and generate changelogs using GitHub Actions, follow the steps below. This process uses release-please to detect your semantic commits, open a release pull request, and publish a GitHub release when it's merged.

## Set Up GitHub Token

Create a personal GitHub token with `repo` scope and add it to your repository secrets as `MY_RELEASE_PLEASE_TOKEN`.

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-1.1t7_nkfd39d9m.webp&w=3840&q=75) ![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-2.3l5kexrlhw67e.webp&w=3840&q=75) ![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-3.1smppv3068qta.webp&w=3840&q=75)

Then, go to **Settings → Actions → General** and set **Workflow permissions** to **Read and write permissions**.

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-4.3wwpvk5c-fihf.webp&w=3840&q=75)

The automated release workflow is located at `.github/workflows/release.yml` — it runs automatically on `main` branch pushes or can be triggered manually.

## Make Semantic Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) to describe your changes. These commits determine how versions are bumped and changelogs are generated.

**Examples:**

```
git commit -m "feat: add note search feature"
git commit -m "fix: correct login bug on Android"
```

Common prefixes:

-   `feat:` — for new features
-   `fix:` — for bug fixes
-   `chore:` — for maintenance
-   `docs:` — for documentation

After pushing your commit, `release-please` will create an automated PR proposing the next version and changelog.

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-5.2c7ik7476bab4.webp&w=3840&q=75)

## Merge the Auto-Generated PR

When you're ready to release, merge the pull request created by `release-please`. This can be done via GitHub UI or CLI.

Once merged, it will:

-   Create a new release under **GitHub → Releases**
-   Bump the app version (e.g., `v1.2.0`)
-   Generate and publish a changelog

![NativeLaunch github action](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fgithub-action-6.2_-63eqhmc9yx.webp&w=3840&q=75)

The release is triggered **only when the PR is merged into `main`**.

* * *

## Summary

By using `release-please` with GitHub Actions, you streamline your release workflow: no manual tagging, changelog writing, or version bumping.

Perfect for fast-moving projects and solo devs.

## Tips

-   Use **semantic commit messages** to control versioning.
-   Add `[skip release]` to your commit message to avoid triggering a release.
-   `feat:` and `fix:` bump the version; `chore:` or `docs:` don’t unless configured.

## Resources

[

### Release Please

github.com/googleapis/release-please



](https://github.com/googleapis/release-please)[

### GitHub Actions

github.com/features/actions



](https://github.com/features/actions)
