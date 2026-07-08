---
title: "Troubleshooting"
source: https://nativelaunch.dev/docs/troubleshooting
fetched: 2026-07-07
---

# Troubleshooting

This page lists common issues you may encounter when building or submitting your app via **EAS** and **GitHub Actions**, along with solutions.

### Build Fails on GitHub Actions with Credentials are not set up

**Cause**: You haven’t configured build credentials locally with `npx eas credentials`.

**Solution**:

-   Run `npx eas credentials` on your local machine.
-   Complete both **Build Credentials** and **App Store Connect API Key** setup for iOS.
-   Retry the GitHub Action.

* * *

### EAS Submit Fails with Missing ascAppId

**Cause**: The `ascAppId` is not defined in `eas.json` under `submit.production.ios`.

**Solution**:

-   Add the `ascAppId` from App Store Connect:

```
"ascAppId": "YOUR_ASC_APP_ID"
```

* * *

### GitHub Action Fails on --local Build

**Cause**: GitHub-hosted runner runs out of resources or fails to complete the build.

**Solution**:

-   Make sure your workflow uses the correct runner (`macos-latest` or `ubuntu-latest`).
-   Optimize dependencies and clean up unnecessary assets.
-   Consider splitting the workflow or caching dependencies.

* * *

### Android Build Fails Due to Missing Signing Key

**Cause**: Android signing key (keystore) was not set up.

**Solution**:

-   Run `npx eas credentials` and follow the Android keystore configuration.
-   Ensure `credentialsSource: "remote"` is set in your `eas.json`.

* * *

### EXPO\_PUBLIC\_ Environment Variables Not Available

**Cause**: Required environment variables are not defined in GitHub repository secrets.

**Solution**:

-   Go to GitHub → **Settings → Secrets → Actions** and add all required variables.
-   Ensure your Action workflow loads these values under `env:`.

* * *

### Sentry Upload Fails

**Cause**: Missing `SENTRY_AUTH_TOKEN` or `EXPO_PUBLIC_SENTRY_DSN` secrets.

**Solution**:

-   Ensure both secrets are added to GitHub.
-   Verify that `sentry-expo` is installed and configured in your project.
-   Double-check that source maps are preserved during the build.

* * *

### release-please Does Not Create PR

**Cause**: Commit messages are not semantic or GitHub token is missing.

**Solution**:

-   Use proper semantic commits like `feat:`, `fix:`, `chore:`, etc.
-   Ensure the `MY_RELEASE_PLEASE_TOKEN` secret is defined and has `repo` scope.

* * *

If your issue is not listed here, try running the failing command locally with the `--verbose` flag for more details. Also check logs in the GitHub Actions UI.
