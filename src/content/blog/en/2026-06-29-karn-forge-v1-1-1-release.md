---
title: Karn Forge v1.1.1 — Windows Install Fix
description: A targeted patch that fixes several crashes preventing Karn Forge from working correctly after installation on Windows.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.1']
lang: en
---

# Karn Forge v1.1.1

If you installed v1.1.0 on Windows and ran into a crash on launch — or found that AI chat never worked — this is the patch for you. v1.1.1 is a focused bug-fix release with no new features; it just makes sure the app actually runs correctly after installation.

## What's Fixed

### "Cannot find module" crash on launch

The most visible issue: after installing v1.1.0, Forge crashed immediately with an error about a missing module. The packaged build was missing several internal directories (`utils/`, `mcp/`) that the app needs at startup. This is fixed — those directories are now correctly bundled.

### AI chat always erroring on Windows

Even if the app launched, starting an AI chat would immediately fail with "Failed to start Claude". The root cause was that Forge was passing an invalid working directory to the Claude subprocess — a virtual path inside the app archive that Windows doesn't recognize as a real folder. The subprocess now starts from the user's home directory, which always exists.

### MCP servers never registering with Claude

Karn's MCP integration (the tools that let Claude search cards, read your library, and interact with the canvas) was silently failing to register. The configuration file was being written to a read-only location inside the app archive instead of `~/.claude/settings.json` where Claude actually reads it. Fixed.

### Canvas data wiped on MCP canvas tool calls

If Claude used a canvas arrangement tool (create group, create sticker), it would silently overwrite the existing canvas state with only the new element, losing everything else. A property name mismatch (`canvas_json` vs `canvasJson`) caused the canvas read to always return empty before writing. Fixed.

### Windows installer couldn't be built

The CI build was failing to produce a Windows installer because the required `icon.ico` file was missing from the repository. The icon is now generated and included, so installers build correctly going forward.

## Upgrade

If you're already running Forge, open **Settings → Updates** and click **Check for Updates** — Forge will find v1.1.1 automatically.

For a fresh install, grab the latest from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.1.1).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
