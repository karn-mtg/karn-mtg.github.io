---
title: Karn Forge v1.1.4 — Card Search Fixed
description: A patch release fixing card search, which could silently return zero results due to a database schema mismatch.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.4']
lang: en
---

# Karn Forge v1.1.4

This is a small but important patch release: card search is fixed. If you updated your card database recently and then found you couldn't look up your own commander, this is the fix.

## What's Fixed

### Card search returning no results

Karn Forge's card search queried a couple of columns — `image_url` and `released_at` — directly off the `cards` table. Those columns don't exist there anymore: printing-specific data like card art moved to its own `card_images` table a while back, keyed by `oracle_id`, since a single card can have many printings with different art.

The mismatch meant every search query failed at the database level. There was no error banner or broken-image icon to point at — search just came back empty, every time, for every card, including your commander. Card art is also now picked correctly per search result, pulling the most recent printing that actually has art available.

## Upgrade

Open **Settings → Updates** and click **Check for Updates** to pick this up automatically.

For a fresh install, grab it from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.1.4).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
