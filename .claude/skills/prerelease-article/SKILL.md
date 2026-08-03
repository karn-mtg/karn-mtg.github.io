---
name: prerelease-article
description: Generate a data-driven Pre-Release Article for an MTG set — pulls card data via the karn MCP tools, runs the B.R.E.A.D. scoring pipeline, and scaffolds the article content. Use when asked to write/update a pre-release article for a set, or to regenerate one after the card DB updates.
---

# Pre-release article

Produces `/prerelease/<slug>` articles: card-count/color-distribution stats plus a B.R.E.A.D.
(Bomb / Removal / Evasion / Aggro / Diversity) scoring pass over every card in a set, with a
card explorer. See `feature.md` at the workspace root for the full feature spec — this skill
currently covers Phase 1 (General Information + B.R.E.A.D.); word-cloud/synergy and sealed-
probability analysis are documented there as later phases.

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
   content collection schema in `src/content/config.ts`). Print the summary line it logs and
   sanity-check a handful of top `bestCards` by eye — a known removal spell should score high on
   `removal`, a big vanilla creature high on `bomb`, etc. If something looks systematically off,
   tune weights in `scripts/prerelease/lib/bread-rules.json` (not the `.mjs` logic) and re-run.

4. **Scaffold the article.** Create `src/content/prerelease/en/<date>-<slug>.md` with frontmatter:
   `title, description, date, setCode, setName, lang: en, generalInfoIntro, breadIntro`
   (`generalInfoIntro`/`breadIntro` are the short "digestible text" blurbs feature.md asks for
   between sections — plain sentences, not markdown). Mirror it into `pt-br/`, `de/`, `es/` under
   the matching `lang` value once the English version is finalized (this site is i18n'd from v1).

5. **Write the prose** (this is the LLM part): read the generated `prerelease-data/<code>.json`
   and ground `generalInfoIntro`/`breadIntro`, plus a short intro/closing in the markdown body, in
   the *actual* numbers — e.g. name the strongest color pair from `manaCombos`, call out a couple
   of `bestCards` by name. Don't invent numbers not present in the data file.

6. **Verify.** `npm run dev`, visit `/prerelease/<slug>` and `/pt-br/prerelease/<slug>`, confirm
   the color chart, B.R.E.A.D. explorer filters, best-cards list, and mana-combo ranking all
   render. Then `npm run build` to confirm the full site still builds.

## Notes

- Steps 1–3 require no running server — the MCP tool call happens once, live, in the Claude Code
  session doing the authoring; `analyze.mjs` itself is pure Node with no network calls.
- `scripts/prerelease/.cache/` is gitignored raw input, not part of the shipped site.
