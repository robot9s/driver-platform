---
title: "Manage Dependencies"
source: https://nativelaunch.dev/docs/setup/manage-dependencies
fetched: 2026-07-07
---

# Manage Dependencies

Managing dependencies properly ensures stability and long-term maintainability in your NativeLaunch project.

NativeLaunch recommends using **`npx expo install`** whenever possible — it helps keep your dependencies compatible with your current Expo SDK version.

* * *

## Why use npx expo install?

`npx expo install` is a smart wrapper around your preferred package manager (npm, yarn, or pnpm) that provides:

-   **Expo compatibility**: installs versions matching your current Expo SDK
-   **Patches known issues**: applies Expo fixes automatically
-   **Works across npm/yarn/pnpm**
-   **Used by default in NativeLaunch** (we recommend **npm**)

* * *

## Install a Package

```
npx expo install <package-name>
```

This ensures you install the version compatible with your current SDK.

* * *

## Remove a Package

Use your preferred package manager directly:

```
npm uninstall <package-name>
# or
yarn remove <package-name>
```

* * *

## Update a Package

To install the latest compatible version:

```
npx expo install <package-name>@latest
```

* * *

## Check for Outdated Packages

```
npx expo doctor --fix-dependencies
```

This command suggests updates and auto-fixes Expo-specific issues.

* * *

## Best Practices

-   Use `npx expo install` for adding or updating packages.
-   Use `npm uninstall` or `yarn remove` when removing packages.
-   Run `npx expo doctor` regularly to ensure healthy dependencies.
-   Restart the bundler after updates:

```
npx expo start --clear
```

-   Always test your app after installing or updating packages.

* * *

Keeping dependencies in sync with Expo’s ecosystem ensures your app runs smoothly and stays up to date with the latest tooling.
