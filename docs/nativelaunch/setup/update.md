---
title: "Updating codebase"
source: https://nativelaunch.dev/docs/setup/update
fetched: 2026-07-07
---

# Updating codebase

Use this guide if you want to keep your project in sync with future **NativeLaunch** releases. There are two main ways to keep your project in sync with future **NativeLaunch** updates. Choose the one that best fits your level of customization.

### Option A — Safe Manual Update Workflow (recommended)

Best for customized apps

If you plan to significantly modify the template, manual updates are safer and usually faster than resolving git conflicts.

**How it works:**

1.  Keep a clean clone of the template for reference:

```
git clone git@github.com:nativelaunch/expolaunch-template.git expolaunch-template
```

2.  Build your app in a separate repo (or from the ZIP archive):

```
git init my-app
cd my-app
git remote add origin git@github.com:{your-username}/{your-repo}.git
```

3.  When a new release is available:
    
    -   Update your clean clone with `git pull`
    -   Review differences (configs, scripts, features)
    -   Manually copy or re-implement the parts you need
4.  Test locally and commit changes with a clear message:
    

```
git commit -m "chore: apply updates from template v1.3.0"
```

This approach avoids merge conflicts and keeps you in full control of what enters your codebase.

### Option B — Track via upstream (advanced)

Best for minimal customization

If you keep your project close to the original template, you can track updates directly via `upstream`.

**Setup (one time):**

If you cloned our template repo and want your own origin:

```
git remote rename origin upstream
git remote add origin git@github.com:{your-username}/{your-repo}.git
git push -u origin main
```

If you already have your own origin, just add upstream:

```
git remote add upstream git@github.com:nativelaunch/expolaunch-template.git
```

**Pull updates later:**

```
git fetch upstream
git checkout -b update/from-upstream
git merge upstream/main   # or: git rebase upstream/main
git push origin update/from-upstream
```

Heads up

Pulling upstream into a customized app can cause merge conflicts. Always review changes and test before merging.

### FAQ

1.  Which option should I choose?
    
    -   Heavy customization → Option A (manual)
    -   Light customization → Option B (upstream)
2.  What if I started from the ZIP archive? Create your own repo, then either:
    
    -   Follow Option A with a clean clone for reference
    -   Or add the template as `upstream` for direct sync
3.  Merge or rebase?
    
    -   Both are fine. `merge` is simpler, `rebase` keeps history linear. Pick what your team prefers.
