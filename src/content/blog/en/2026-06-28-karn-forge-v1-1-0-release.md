---
title: Karn Forge v1.1.0 — Self-Managing Updates
description: Karn Forge and Arsenal now update themselves. No more manual installer downloads or binary swaps.
date: '2026-06-28'
author: karn-team
tags: ['release', 'forge', 'v1.1.0']
lang: en
---

# Karn Forge v1.1.0

This release is a straightforward one: Karn Forge and its Arsenal backend can now update themselves. You won't need to visit the releases page to stay current.

## What's New

### App Auto-Updater

Forge checks for a new version a few seconds after it launches. When one is available, **Settings → Updates** shows a notification with a download button. Click it, wait for the download, then click **Install** — the app restarts with the new version applied. That's it.

No need to download a new installer, run it, or deal with the old one. The update installs directly inside the running app.

### First-Run Install Wizard

Setting up Arsenal on a fresh install used to require a bit of manual work. Now there's a one-click wizard. On first launch, Forge prompts you to set up Arsenal and handles the three downloads in sequence — the server binary, the cards database, and the rules database — with a live progress indicator for each step.

The whole process takes under a minute on a typical connection.

### Arsenal Server Self-Update

The Arsenal backend can now update itself in place. When a new server version is available, you'll see it listed alongside the cards and rules databases in the Arsenal panel — and updating it works the same way: click, wait, done. No manual binary replacement.

## Under the Hood

- `electron-updater` handles the forge app update flow with a custom IPC bridge to the renderer
- Arsenal's `/updates` endpoint now checks all four components in one request: server, cards, rules, and agent
- New `/update/server` endpoint streams download progress as SSE so the UI can show a live progress bar
- MCP settings are rewritten automatically after any install or update, so Claude always finds the latest binary path without a restart

## Download / Upgrade

If you're already running Forge, open **Settings → Updates** and click **Check for Updates**. Forge should find v1.1.0 automatically.

For a fresh install, grab the latest from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.1.0).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
