---
title: Karn Forge v1.1.3 — MCP Servers Fixed
description: A patch release fixing the karnforge and karn Arsenal MCP servers, which were failing to connect on Windows.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.3']
---

# Karn Forge v1.1.3

This is a focused patch release: it fixes both of Karn Forge's MCP servers, which could fail to connect after installation — especially noticeable if you drive Forge from an AI agent like Claude Code.

## What's Fixed

### `karnforge` MCP server crashing on startup

The `karnforge` MCP server runs its TypeScript entry point through `tsx` inside the packaged Electron app. `tsx`'s module resolver doesn't fall back to `NODE_PATH` the way plain Node does, so dependencies like `zod` and `esbuild` — present in the packaged app but not unpacked onto the real filesystem — were unresolvable. The server crashed before it could even connect, and Claude Code (or any MCP client) would just see it as failed.

The fix unpacks all of `node_modules` instead of cherry-picking individual packages, so every dependency lives on disk where normal module resolution can find it.

### Startup logs corrupting the MCP connection

A `console.log` call during database initialization was writing plain text to stdout — the same stream MCP servers use for JSON-RPC. Since it ran before the transport even connected, it corrupted the handshake on every launch. Startup logging now goes to stderr, where it belongs.

### `karn` Arsenal server binary

Separately, the previous `karn` Arsenal server releases shipped with a corrupted Python DLL bundle and would fail immediately with a `LoadLibrary` error on Windows. The cause turned out to be a stray `strip=True` in the PyInstaller build config — GNU `strip` isn't safe on MSVC-built Windows DLLs like `python311.dll`, and quietly corrupted it during CI builds. `server-v1.1.3` fixes this — Arsenal's rules engine, combo detection, and semantic search are back online.

## Upgrade

If you're already running Forge, open **Settings → Updates** and click **Check for Updates**. If Arsenal shows an update for the server component, install it too.

For a fresh install, grab it from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.1.3).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
