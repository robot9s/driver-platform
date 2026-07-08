---
title: "AGENTS.md"
source: https://nativelaunch.dev/docs/agents
fetched: 2026-07-07
---

# AGENTS.md

`AGENTS.md` is a structured project context file designed specifically for AI assistants.

![react-native expo agents.md](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fagents.1wsqdnge8m3zp.webp&w=3840&q=75)

It acts as a single source of truth that explains how your project works — not for humans, but for AI tools.

Instead of repeatedly describing your stack, architecture, conventions, and patterns in every prompt, you define them once inside `AGENTS.md`.

AI tools can then use this file as a persistent reference when generating code, refactoring features, or answering project-related questions.

Learn more about the concept at: [https://agents.md/](https://agents.md/)

* * *

## Why NativeLaunch includes it

NativeLaunch is built as an AI-first starter.

Modern development increasingly relies on tools such as:

-   ChatGPT
-   JetBrains AI Assistant
-   GitHub Copilot
-   Claude
-   Cursor
-   VS Code AI extensions

By default, most AI tools only see:

-   the current file
-   selected code
-   limited surrounding context

Without structured project guidance, this often results in:

-   inconsistent folder placement
-   duplicated logic
-   incorrect architecture assumptions
-   breaking existing conventions

`AGENTS.md` solves this by explicitly defining:

-   project architecture
-   feature boundaries
-   state management approach
-   styling conventions
-   file and folder structure
-   naming patterns
-   integration patterns (auth, payments, analytics, notifications)

This leads to:

-   higher quality code generation
-   architectural consistency
-   fewer refactors later
-   faster feature development

* * *

## How to use it with AI tools

When working inside your IDE:

1.  Open the AI chat panel
2.  Ask the assistant to read `AGENTS.md`
3.  Use prompts such as:

-   "Use AGENTS.md as project context"
-   "Follow the architecture defined in AGENTS.md"
-   "Generate a feature aligned with AGENTS.md"

You can also reference it explicitly:

> According to AGENTS.md, where should this feature live?

This ensures that generated code respects your existing structure and conventions.

* * *

## When should you update it?

Update `AGENTS.md` whenever you:

-   Introduce a new major feature
-   Change architecture or folder structure
-   Add new integrations
-   Refactor core systems
-   Change coding standards

Think of it as:

> README for AI contributors.

* * *

## Why this matters

AI-assisted development is no longer experimental — it is part of daily workflows.

Projects that provide structured AI context:

-   Scale faster
-   Maintain consistency
-   Reduce onboarding time
-   Lower cognitive load

`AGENTS.md` turns your project into a system that both humans and AI can understand.

And that is a long-term advantage.
