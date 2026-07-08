---
title: "Type Definitions"
source: https://nativelaunch.dev/docs/supabase/typedefinitions
fetched: 2026-07-07
---

# Type Definitions

Supabase provides a CLI command to generate type definitions for your database schema. This can be useful for generating type definitions for your database schema and for ensuring that your application is type-safe if you're using TypeScript.

Check out the [official Expo documentation](https://supabase.com/docs/guides/api/rest/generating-types) for more information on how to generate database type definitions fo.

## Generating Type Definitions

To generate type definitions for your database schema, run the following command in your terminal:

```
npx supabase gen types --lang=typescript --project-id "$PROJECT_REF" --schema public > ./src/shared/config/supabase/database.ts
```
