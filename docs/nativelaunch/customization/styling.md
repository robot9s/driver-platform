---
title: "Styling"
source: https://nativelaunch.dev/docs/customization/styling
fetched: 2026-07-07
---

# Styling

NativeLaunch uses [UniWind](https://uniwind.dev) — a Tailwind CSS v4-powered styling solution for React Native — along with [HeroUI Native](https://heroui-native.com) for UI components. This gives you utility-first styling with a modern CSS v4 config and a consistent theming system.

## Tailwind configuration

UniWind uses a CSS-based config (Tailwind v4 approach) instead of the traditional `tailwind.config.js`. Your theme tokens are defined in a CSS file:

global.css

```
@import "tailwindcss";

:root {
  --background: ...;
  --foreground: ...;
  --primary: ...;
  --muted: ...;
  --card: ...;
  --border: ...;
  --accent: ...;
  --destructive: ...;
  --radius: ...;
}
```

You can use any of these tokens as utility classes in your components:

```
<Text className="text-foreground bg-background">
  Hello styled world!
</Text>
```

## Theme system

Design tokens are defined for both light and dark modes. The current theme is applied automatically based on the device color scheme using the `useColorScheme` hook — handled internally in `useColorScheme.tsx`.

## UI components

NativeLaunch uses [HeroUI Native](https://heroui-native.com) for its base UI components. All components support `className` and work seamlessly with UniWind utility classes.

```
import {Button} from '@heroui/native'

<Button className="bg-primary">
  Save changes
</Button>
```

## Extending styles

You can:

-   Modify the CSS config to update or add custom design tokens
-   Create your own tokens for branding, spacing, typography, etc.
-   Keep everything consistent across light/dark themes

This setup gives you full control over styling while staying scalable and maintainable.
