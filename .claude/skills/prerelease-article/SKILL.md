---
name: prerelease-article
description: Generate a data-driven Pre-Release Article for an MTG set — pulls card data via the karn MCP tools, runs the B.R.E.A.D. + word-cloud/synergy pipeline, and scaffolds the article content. Use when asked to write/update a pre-release article for a set, or to regenerate one after the card DB updates.
---

# Pre-release article

Produces `/prerelease/<slug>` articles: card-count/color-distribution stats, an Interaction/Synergy
breakdown (word cloud, top synergy words, word×color and mechanic×color matrices, top synergy
combinations), and a B.R.E.A.D. (Bomb / Removal / Evasion / Aggro / Diversity) scoring pass over
every card in the set, with a card explorer. See `feature.md` at the workspace root for the full
feature spec — this skill covers Phases 1 and 2 (General Information, Interaction/Synergy, and
B.R.E.A.D.); sealed-probability/archetype-comparison analysis (Phase 3) is documented there as a
later phase, not built yet.

## Steps

1. **Fetch the set.** Call `mcp__karn__search_cards_in_set` with `set_code: "<code>"` and
   `top_k: 500`. If the result is too large and gets saved to a tool-result file instead of
   being inlined, read that file and extract the `result` array from it.

2. **Cache a trimmed copy.** Write a JSON array to `scripts/prerelease/.cache/<code>.raw.json`,
   one object per non-digital card with exactly these fields (this is the `analyze.mjs` input
   shape): `oracle_id, name, mana_cost, cmc, type_line, oracle_text, colors, color_identity,
   keywords, power, toughness, rarity, collector_number, image_normal, set`. (`image_normal`
   comes from `full_data.image_uris.normal`; the rest map directly from the MCP result, mostly
   from `full_data`.)

3. **Run the analyzer.**
   ```
   node scripts/prerelease/analyze.mjs <code>
   ```
   This writes `src/content/prerelease-data/<code>.json` (validated against the `prerelease-data`
   content collection schema in `src/content/config.ts`), including `wordCloud`, `topWords`,
   `wordColorMatrix`, `mechanics`, `mechanicColorMatrix`, `mechanicsBySynergy`,
   `synergyCombinations`, and `crossCardSynergies` alongside the B.R.E.A.D. fields. Print the
   summary line it logs and sanity-check a handful of top `bestCards` by eye — a known removal
   spell should score high on `removal`, a big vanilla creature high on `bomb`, etc. If something
   looks systematically off, tune weights in `scripts/prerelease/lib/bread-rules.json` (BREAD) or
   the stopword list in `scripts/prerelease/lib/stopwords.mjs` (word cloud) — not the `.mjs` logic
   — and re-run.

   `crossCardSynergies` (`lib/crossCardSynergy.mjs`) is the headline synergy metric and needs no
   per-set curation: it's driven by the evergreen theme library in
   `scripts/prerelease/lib/synergy-themes.json` (Draw Matters, Sacrifice Matters, Landfall,
   Artifacts/Treasure, +1/+1 Counters, Graveyard/Mill, Tokens, Lifegain), matched over oracle text.
   Unlike `synergyCombinations` (same-card keyword pairs — a narrower, secondary signal, still
   computed but rendered below the fold), this looks for **payoff cards on one card paired with
   generic enabler cards on other cards**, and ranks by the Poisson-approximated chance a 6-pack
   sealed pool opens enough of both — the actually useful "which synergy has a real shot at coming
   together" signal. If a theme's regex is too loose/tight for a set's specific phrasing (e.g. it
   undercounts a real theme, or a pattern collides with unrelated reminder text), tune
   `synergy-themes.json` the same way you'd tune `bread-rules.json` — don't touch
   `crossCardSynergy.mjs` itself.

4. **(Optional) Validate synergy combinations against real rules interactions.**
   `computeSynergyCombinations` in `combinationScore.mjs` only counts same-card keyword
   co-occurrence — it can't tell a real rules-level interaction (e.g. Ferocious checking power 4+,
   which synergizes with anything granting +X/+X) from pure coincidence (an Adventure card whose
   spell side happens to Mill — Adventure is a casting-timing mechanic with no functional link to
   Mill). After running `analyze.mjs` once, inspect the raw `synergyCombinations` in
   `src/content/prerelease-data/<code>.json` and, for each candidate pair, ground a verdict in the
   actual comprehensive rules text using `mcp__karn__search_rules`, `mcp__karn__get_related_rules`,
   and `mcp__karn__get_rules_primer` — check whether one mechanic actually produces/checks
   something the other consumes or cares about. (`mcp__karn__get_combos` and `traverse_graph` are
   backed by the existing Commander/combo card graph and won't have entries for brand-new
   prerelease cards — only useful as a bonus check on reprinted staples.) Write verdicts to
   `scripts/prerelease/data/set-synergy-notes/<code>.json`: `[{mechanics: [a, b], verdict:
   "confirmed" | "coincidental", mechanism: "<one-line why>"}]`. Re-run `analyze.mjs` — it
   auto-applies these notes, sorts confirmed pairs to the top, and folds unconfirmed/coincidental
   ones into a collapsed section in the article. Coming back with fewer than ~5 `confirmed` pairs
   is a legitimate finding, not a bug — it means the set doesn't deliberately stack keyword
   abilities and synergy lives elsewhere (check `mechanicsBySynergy` / `creatureTypes` instead). If
   you want a wider candidate pool to judge, re-run with a lower `minCount` in the
   `computeSynergyCombinations` call rather than trying to force more `confirmed` verdicts.

5. **(Optional) Curate official named mechanics.** Scryfall's `keywords` field only covers
   recognized keyword abilities — set-specific "ability words" WotC calls out in its own
   mechanics preview article (e.g. Storied, Recruit for The Hobbits) usually aren't in it. If
   such an article exists for the set, fetch it, and for anything missing from `analyze.mjs`'s
   output `mechanics` list, add an entry to `scripts/prerelease/data/set-mechanics/<code>.json`:
   `{name, field: "oracle_text"|"type_line", pattern, flags, description, source}`. Re-run
   `analyze.mjs` — it auto-detects these via regex and folds them into the mechanics list, the
   mechanic×color matrix, and synergy combinations alongside the Scryfall keywords. This file is
   optional; skip it if no official mechanics article exists.

6. **Scaffold the article.** Create `src/content/prerelease/en/<date>-<slug>.md` with frontmatter:
   `title, description, date, setCode, setName, lang: en, generalInfoIntro, synergyIntro, breadIntro`
   (these are the short "digestible text" blurbs feature.md asks for between sections — plain
   sentences, not markdown; `synergyIntro` is optional but should be filled in for a complete
   article). Mirror it into `pt-br/`, `de/`, `es/` under the matching `lang` value once the
   English version is finalized (this site is i18n'd from v1).

7. **Write the prose** (this is the LLM part): read the generated `prerelease-data/<code>.json`
   and ground `generalInfoIntro`/`synergyIntro`/`breadIntro`, plus a short intro/closing in the
   markdown body, in the *actual* numbers — e.g. name the strongest color pair from `manaCombos`,
   the top `topWords`/`mechanicsBySynergy` entries, or the top `crossCardSynergies` theme (name the
   `comboScore` and a couple of its `topPayoffCards`/`topEnablerCards`); call out a couple of
   `bestCards` by name. If an `archetypeAnalysis` entry has a non-null
   `alternativeSignal`, that's worth calling out explicitly in the analysis prose — it's the
   data disagreeing with WotC's stated archetype for that color pair and pointing at a specific
   mechanic instead. Don't invent numbers not present in the data file.

8. **Verify.** `npm run dev`, visit `/prerelease/<slug>` and `/pt-br/prerelease/<slug>`, confirm
   the color chart, word cloud, word/mechanic matrices, synergy combos table (including its
   confirmed/coincidental split), B.R.E.A.D. explorer filters, best-cards list, mana-combo ranking,
   and archetype-analysis callouts all render. Then `npm run build` to confirm the full site still
   builds.

## Notes

- Steps 1–3 require no running server — the MCP tool call happens once, live, in the Claude Code
  session doing the authoring; `analyze.mjs` itself is pure Node with no network calls.
- `scripts/prerelease/.cache/` is gitignored raw input, not part of the shipped site.
