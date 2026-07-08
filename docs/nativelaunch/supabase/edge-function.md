---
title: "Edge Function Setup"
source: https://nativelaunch.dev/docs/supabase/edge-function
fetched: 2026-07-07
---

# Edge Function Setup

Supabase Edge Functions are server-side TypeScript functions running on [Deno](https://deno.com/), deployed globally at the edge — closer to your users. They allow you to run backend logic securely, without managing traditional infrastructure.

NativeLaunch includes pre-configured Edge Functions for:

-   User self-deletion
-   AI Assistant (OpenAI integration)

This guide explains how to deploy and manage them inside your Supabase project.

* * *

## Project Structure

Edge functions are located inside the `supabase/functions` directory:

```
supabase/
├── functions/
│   ├── user-self-deletion/
│   │   └── index.ts
│   └── ai-chat/
│       └── index.ts
├── migrations/
│   └── *****_remote_schema.ts
└── config.toml
```

Each folder represents one Edge Function.

* * *

## 1\. Install Supabase CLI

Install the [Supabase CLI](https://supabase.com/docs/guides/cli):

```
npm install -g supabase

supabase --version
```

Login to your account:

```
supabase login
```

Link your project:

```
supabase link --project-ref your-project-ref
```

* * *

## 2\. Configure Environment Variables

Some functions (such as the AI assistant) require secrets.

Set your OpenAI key securely:

```
supabase secrets set OPENAI_API_KEY=sk-proj-****
```

Never store API keys in the mobile application.

* * *

## 3\. Deploy Functions

You can deploy a specific function:

```
cd supabase/functions

supabase functions deploy user-self-deletion
```

Or deploy the AI function:

```
supabase functions deploy ai-chat
```

![supabase edge](https://nativelaunch.dev/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsupabase-edge.2z9gorhvyr68j.webp&w=3840&q=75)

## 4\. Invoke the Function from App

The function is already integrated in the NativeLaunch template:

```
import {supabase} from '@shared/config/supabase'

export async function deleteUser(): Promise<void> {
  const {error} = await supabase.functions.invoke('user-self-deletion')

  if (error) {
    console.log('Error deleting user:', error)
    throw new Error(`Error deleting user: ${error}`)
  } else {
    console.log('User account deleted')
  }
}
```

* * *

## Common Use Cases

Supabase Edge Functions are great for:

-   Secure AI integrations (OpenAI)
-   Custom auth logic
-   Integrating 3rd party APIs
-   Data processing
-   Scheduled jobs

* * *

## Deployment Strategy

Deploy safely:

```
# production
supabase functions deploy user-self-delete --project-ref your-production-project
```

Manage versions:

```
supabase functions deploy user-self-delete:v1
```
