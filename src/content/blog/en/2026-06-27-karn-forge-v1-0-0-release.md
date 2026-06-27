---
title: Karn Forge v1.0.0
description: The first full release of Karn Forge is here — everything from the AI-powered chat panel to canvas widgets, collection tracking, and a brand new chat-controller MCP.
date: '2026-06-27'
author: karn-team
tags: ['release', 'forge', 'v1.0.0']
lang: en
---

# Karn Forge v1.0.0

When we [announced Karn Forge](./2026-06-23-introducing-karn-forge) a few days ago we showed you the bones. Today we're shipping the whole thing: **Karn Forge v1.0.0**, the first stable release.

Here's what's in it.

## The Canvas

The core of Forge is an infinite drag-and-drop canvas for your deck. Cards stack by default, but you can organize them into **groups** (grid, horizontal stack, or vertical stack), add **stickers** for notes written in Markdown, and drop **widgets** anywhere on the board for live analytics.

Every deck can have multiple named canvas arrangements — so your "aggro build" and "control build" can each have their own layout, and switching between them is instant.

Pan with drag, zoom with Ctrl+Wheel (10–400%), rubber-band select, multi-drag, undo/redo up to 50 steps. It auto-saves with a 1500ms debounce.

## Card Search

16 filter types: free text (name or oracle text), colors, types, rarity, format legality, CMC range, power/toughness, price cap, keywords (20 of them), card layout, EDHREC rank, color count, produced mana, reserved list, game changers.

Results show up instantly. Click to add to the current deck board. The tooltip is global — hover any card anywhere in the app and the art crop pops up.

## Canvas Widgets

10 built-in analytics widgets you can drop on the canvas and resize:

- **Mana Curve** — CMC histogram, configurable cap
- **Color Distribution** — pip count bars for WUBRGC
- **Land Ratio** — SVG donut vs target%, diff badge
- **Type Breakdown** — creatures / instants / sorceries / etc.
- **Deck Stats** — total cards, avg CMC, land count
- **Draw Odds** — hypergeometric probability for any card group
- **Deck Roles** — ramp / draw / removal / board wipes vs EDH ratios
- **EDHREC Inclusion** — % tier distribution + per-card badge overlay
- **Collection Status** — in-recipient / proxy / missing counts
- **EDHREC Commander** — commander-page recommendations with synergy bars

You can also build your own widgets with a live code editor and drop them on any canvas.

## AI Chat

The AI panel (toggle on the left sidebar) connects to Claude and knows your deck. It uses your existing Claude Code authentication — no separate API key setup needed if you already have Claude Code installed.

What's new in 1.0.0: **Claude can now reach into the UI**. The new `chat-controller` MCP server gives Claude two tools:

- `emit_block` — push rich content into the chat: card showcases, swap suggestions, deck diffs, navigation events, thinking indicators
- `ask` — show the user an interactive prompt (choice, confirm, or card pick) and suspend until they respond

So instead of Claude describing what to do in plain text, it can show you the cards it's talking about, suggest a swap with a one-click accept button, or ask you to pick between two commanders directly in the chat.

Claude CLI and OpenAI are both supported as providers.

## Collection & Wishlist

**Collection**: track every physical card with condition, foil status, language, acquired price, and recipient assignment (binder, box, deck box). Bulk import with `4 Lightning Bolt` format, CSV export, portfolio value at a glance.

**Wishlist**: priority levels (Low / Normal / High / Critical), drag to reorder, "owned" badge when you have the card, inline add-to-deck.

**Card status on canvas**: cards show a colored dot overlay — green if they're in the right binder, yellow if they're in a different one, blue if in collection but unassigned, red if missing.

## Commander Spellbook

Open any deck and hit the **Combos** tab — it fetches all known combos involving your cards from Commander Spellbook and shows them with the full card list, steps, and result.

## Global Search

**Ctrl+K** opens a full-screen overlay that searches pages, decks, folders, and cards in one shot. Keyboard navigation throughout.

## Under the Hood

- Electron 33 + React 19 + TypeScript + Vite + Tailwind CSS v3
- Two SQLite databases: `library.db` for your data, `prints.db` for the card catalog
- MCP server with 31 tools and 5 resources — Forge itself works as an MCP server inside Claude Code
- Imperative DOM canvas (no React re-renders for pan/zoom with 100+ cards)
- All data in `~/karnData/`

## Download

Grab the installer from the [Releases page](https://github.com/karn-mtg/forge/releases/tag/v1.0.0). Windows NSIS installer available now; macOS and Linux builds on the way.

You'll also want [Karn Arsenal](https://github.com/karn-mtg/karn/releases) for the card database — Forge's Settings page handles the download and registration automatically.

## What's Next

- macOS DMG and Linux AppImage builds
- Deck sharing — shareable links and import from URLs
- Moxfield / Archidekt / Deckbox import
- More AI-driven canvas actions (auto-group by strategy, highlight synergies)

---

Questions or issues? [GitHub Issues](https://github.com/karn-mtg/forge/issues) is the place.
