---
title: Karn Forge v1.1.2 — Bug Fixes and Dev Experience
description: A patch release fixing logo loading, database schema ordering, and DB startup errors, plus two quality-of-life improvements for developers.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.2']
lang: en
---

# Karn Forge v1.1.2

v1.1.2 is a small but important patch. It fixes a few quiet bugs that could cause issues in packaged builds, and brings a couple of improvements that make the development experience noticeably better.

## What's Fixed

### Sidebar logo missing in packaged builds

The Karn Forge logo wasn't showing up after installation on some systems. The logo was referenced via a static `/biglogo.png` path that works in development but breaks in the packaged Electron app, where assets are bundled differently. It now uses the correct bundled asset URL and loads reliably everywhere.

### Database index created before its table existed

A schema ordering bug caused the `collection` index (which references the `recipients` table) to be declared in the initial `CREATE TABLE` block before `recipients` was created. This didn't cause visible crashes in most cases due to SQLite's deferred constraint checking, but it was wrong and has been corrected — the index is now created in the migration block where it belongs.

### Startup errors swallowed silently

If the library database failed to initialize at startup, the error was being dropped without any log output, making it nearly impossible to diagnose. Startup now wraps DB initialization in a proper try/catch and logs the full error with stack trace before re-throwing.

## What's New

### Dev builds use a separate data directory

Running Forge in development mode (`npm run dev`) now stores its data in `karnData-dev` instead of your real `karnData` folder. This means testing and experimenting during development can't accidentally corrupt or pollute your actual collection. Production builds are completely unaffected.

### DEV badge in development mode

A small **DEV** badge now appears in the corner of the window when Forge is running in dev mode. It's a minor thing, but it makes it immediately obvious which window is your dev build versus a production install — no more second-guessing which one you're looking at.

## Upgrade

If you're already running Forge, open **Settings → Updates** and click **Check for Updates**.

For a fresh install, grab it from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.1.2).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
