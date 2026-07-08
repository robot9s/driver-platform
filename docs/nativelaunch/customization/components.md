---
title: "Components"
source: https://nativelaunch.dev/docs/customization/components
fetched: 2026-07-07
---

# Components

NativeLaunch includes a structured set of UI components grouped into three main categories:

-   **Reusables** — components from [HeroUI Native](https://heroui-native.com), organized in the `shared/ui` folder
-   **UI primitives** — reusable low-level components
-   **Widgets** — high-level, logic-rich UI blocks

The component architecture is styled using a utility-first approach powered by **UniWind** (Tailwind CSS v4).

## Folders overview

```
widgets/             ← Custom animated and logic-based components
shared/
├── ui/              ← Components from HeroUI Native
├── ui-primitives/   ← Custom layout and interaction components
```

## 1\. Reusable UI components

The `shared/ui` folder contains prebuilt components from [HeroUI Native](https://heroui-native.com). These include common UI elements like `Button`, `Card`, `Switch`, `Input`, `Checkbox`, `Tabs`, and more.

All components support `className` and work seamlessly with UniWind utility classes.

```
import {Button} from '@/shared/ui'

<Button className="bg-primary text-white">
  Continue
</Button>
```

## 2\. UI Primitives

Located in `shared/ui-primitives`, these are small building blocks used throughout the app:

-   `Sheet` — modal bottom sheet (`@gorhom/bottom-sheet`)
-   `Skeleton` — loading placeholder
-   `ConfirmationDialog` — modal with confirm/cancel
-   `ExternalLink` — consistent styled external anchor
-   `ColorPicker`, `DatePicker`, `MonthYearPicker`
-   `TextTicker`, `GenericIcon`, `MenuItem`, etc.

```
import {ConfirmationDialog} from '@/shared/ui-primitives'

<ConfirmationDialog
  title="Are you sure?"
  description="This action cannot be undone."
  onConfirm={() => doSomething()}
/>
```

## 3\. Widgets

In `shared/widgets`, you'll find more advanced, logic-based components:

-   `AnimatedNumber` — number counting animation using Reanimated
-   `LoadingModal` — full-screen modal with spinner and status
-   `DonutChart`, `CircularProgressBar` — data visualizations
-   `ScreenContent` — page layout wrapper
-   `NumericPad` — custom number input for money, PINs, etc.

```
import {AnimatedNumber} from '@/shared/widgets'

<AnimatedNumber value={4523} />
```

## Best practices

-   Use `shared/ui` for standard elements like buttons and inputs
-   Use `ui-primitives` for layout, control, and display logic
-   Use `widgets` for animated or high-level interactive components
-   All components support `className` via UniWind
-   Themes are powered by shared design tokens

This component structure is designed to be clean, scalable, and easy to extend. You can add your own folders inside `shared/` while keeping compatibility with UniWind.
