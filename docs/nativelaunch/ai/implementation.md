---
title: "AI Setup & Implementation"
source: https://nativelaunch.dev/docs/ai/implementation
fetched: 2026-07-07
---

# AI Setup & Implementation

This page explains how to configure and connect OpenAI (ChatGPT) to NativeLaunch using Supabase Edge Functions. You will set up your API key, configure environment variables, and understand how requests flow securely between the mobile app and OpenAI.

## Requirements

To enable the AI feature, you will need:

1.  An OpenAI account [https://platform.openai.com/](https://platform.openai.com/)
2.  An OpenAI API key
3.  A configured Supabase project with Edge Functions enabled

OpenAI API usage is billed based on token consumption. Make sure billing is enabled in your OpenAI account before testing the integration.

![react-native expo chatgpt](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchatgpt.21t-34gtdy5bl.webp&w=3840&q=75)

* * *

## Architecture Overview

The AI integration follows a secure client → server → OpenAI pattern.

Request flow:

1.  The mobile application sends a POST request to a Supabase Edge Function.
2.  The Edge Function reads the `OPENAI_API_KEY` from environment variables.
3.  The function formats the prompt and forwards it to the OpenAI API.
4.  The OpenAI response is returned to the Edge Function.
5.  The Edge Function returns a structured JSON response to the mobile app.
6.  The application renders the result in the chat UI.

This ensures:

-   API keys are never exposed in the client
-   Prompts can be validated or modified server-side
-   Rate limiting can be implemented
-   Logging and monitoring can be added

* * *

## Environment Variables

Set your OpenAI API key inside Supabase:

```
supabase secrets set OPENAI_API_KEY=sk-proj-****
```

Never expose this key inside the mobile application or commit it to version control.

* * *

## Supabase Edge Function Responsibilities

The Edge Function acts as a secure gateway between the mobile app and OpenAI.

It is responsible for:

-   Validating incoming requests
-   Reading secure environment variables
-   Formatting prompts
-   Calling the OpenAI API
-   Handling API errors
-   Returning structured JSON responses

This backend layer centralizes AI logic and protects sensitive credentials.

* * *

## Security Considerations

-   Do not call OpenAI directly from the client.
-   Always route requests through a backend layer.
-   Validate input before forwarding it to OpenAI.
-   Consider implementing rate limiting per user.
-   Monitor usage to prevent abuse.
-   Avoid logging sensitive user data.
