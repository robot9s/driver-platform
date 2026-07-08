---
title: "Navigation & Routing"
source: https://nativelaunch.dev/docs/customization/routing
fetched: 2026-07-07
---

# Navigation & Routing

NativeLaunch uses [`expo-router`](https://expo.github.io/router/docs) — a file-based routing system that simplifies navigation in React Native apps. Below are the key concepts and examples to help you extend or customize navigation.

## Route Structure

The main routing setup lives inside the `app/` directory. Each folder and file corresponds to a screen or route. Route groups are used to split navigation flows:

### Route Groups Overview

-   **`(auth)/`** — Public routes like login or register
-   **`(app)/`** — Protected app routes, only shown after authentication
-   **`(tabs)/`** — Tab-based navigation nested inside `(app)`
-   **`(aux)/`** — Auxiliary routes like modals, confirmations, etc.

## Initial Redirect Logic

The entry point `app/index.tsx` redirects the user based on their auth status:

```
import { Redirect } from 'expo-router'
import { useAuth } from '@app/providers/AuthProvider'

export default function Index() {
  const { userBySession } = useAuth()

  if (userBySession) {
    return <Redirect href="/(app)/(tabs)" />
  }

  return <Redirect href="/(auth)/login" />
}
```

This ensures:

-   Authenticated users go to main tabs
-   Guests are sent to login

## Navigating Between Screens

-   Use `<Link href="/(app)/settings" />` for static linking
-   Use `router.push('/(auth)/login')` for programmatic navigation

## Example Routes & Locations

| Feature | Route Path | File Location |
| --- | --- | --- |
| Login | `/login` | `app/(auth)/login.tsx` |
| Tabs (Notes, Settings) | `/` inside tab navigator | `app/(app)/(tabs)/` |
| Note Details | `/note/[id]` | `app/(app)/note/[id].tsx` |
| Static content | `/privacy-policy` | `app/(aux)/privacy-policy.tsx` |

## Best Practices

-   Use `src/screens/` for UI & logic; keep `app/` for routing only
-   Avoid business logic in `app/` routes — delegate to reusable components
-   For deep linking, configure `expo-linking` in `app.config.ts`

* * *

Need more? Check [expo-router docs](https://expo.github.io/router/docs) or explore the structure in `app/`.
