---
title: "Project Structure"
source: https://nativelaunch.dev/docs/setup/project-structure
fetched: 2026-07-07
---

# Project Structure

NativeLaunch follows a clean, scalable folder layout based on the **FSD (Feature-Sliced Design)** architecture — a modern methodology for structuring frontend applications by business domains, features, and layers. Learn more in the [official FSD guide](https://feature-sliced.design/docs/get-started/overview).

### Why This Structure?

NativeLaunch uses **Feature-Sliced Design (FSD)** — a proven architectural pattern designed for scalability, maintainability, and fast onboarding.

Instead of guessing “where should this file go?”, FSD gives you a clear, layered structure:

-   ✅ **Ready-to-use**: No need to invent your own folder structure — it's already done
-   ✅ **Scalable**: Works great for both small side projects and large production apps
-   ✅ **Separation of concerns**: Business logic, UI, and domain models live in their own layers
-   ✅ **Team-friendly**: Easy for new developers to understand and contribute
-   ✅ **Proven approach**: Inspired by enterprise-grade frontend architecture

Learn more in the [FSD documentation](https://feature-sliced.design/docs/get-started/overview).

![NativeLaunch](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffsd.0h5hdp646vtjy.webp&w=3840&q=75)

* * *

## Full Project Structure

.env

.env.example

.eslintrc.cjs

.prettierrc.json

app.json

package.json

eas.json

tsconfig.json

README.md

* * *

## shared/ — Common reusable modules

This folder contains cross-cutting concerns and foundational utilities used throughout the app:
