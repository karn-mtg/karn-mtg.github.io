---
title: Karn Forge v1.2.0 — Tags Drive Your Canvas, Plus Deck Value
description: Canvas groups are now built from card tags, with a new Tag Manager, a Deck Value widget, and a full test suite under the hood.
date: '2026-08-02'
author: karn-team
tags: ['release', 'forge', 'v1.2.0']
lang: en
---

# Karn Forge v1.2.0

This release rethinks how the arrangement canvas groups your cards, and adds a widget a lot of you have been asking for: deck value.

## What's New

### Canvas groups are now driven by tags

Previously, canvas groups only existed as containers you dragged cards into on the workshop canvas. Now, groups are computed directly from the tags on your cards — tag a handful of cards "Ramp" or "Removal" and they show up grouped on the canvas automatically, at whatever grouping level you're viewing.

This also means tagging is now a first-class part of deck building, not just an organizational side effect of arranging cards visually. You can create, rename, and assign tags right from the deck view with the new **Tag Manager**, and edit a card's tags inline without opening a separate dialog.

### Deck Value widget

There's a new widget for the canvas: **Deck Value**. It shows the estimated market value (USD, non-foil) of your deck based on Scryfall pricing data, and flags how many cards in the deck don't have price data available yet. Toggle it to include your sideboard or just your main deck.

## Under the Hood

This release also brings a real test suite to Forge for the first time — vitest and Testing Library now cover stores, hooks, and utility functions, which should mean fewer regressions as the app grows. There's also a new visual-inspect script for quickly capturing screenshots of the UI during development.

## Download / Upgrade

Open **Settings → Updates** and click **Check for Updates** to pick this up automatically.

For a fresh install, grab it from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.2.0).

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
