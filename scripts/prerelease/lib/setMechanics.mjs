import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Some set-specific "ability words" (Storied, Recruit, Hone counters, ...)
 * aren't tagged in Scryfall's `keywords` array — that field only covers
 * recognized keyword abilities, not every named mechanic WotC calls out in
 * set-preview articles. `data/set-mechanics/<setCode>.json` is an optional,
 * hand-curated reference (sourced from WotC's own mechanics article for the
 * set) that fills that gap: a list of {name, field, pattern, flags,
 * description} definitions detected by regex over oracle_text or type_line.
 *
 * Returns a *new* array of cards with matched names appended to `keywords`,
 * so the existing mechanics/word-cloud/combination pipeline picks them up
 * automatically — callers that don't want this (bread scoring, color/
 * creature-type stats) should keep using the original `raw` array.
 */
export function loadNamedMechanics(setCode) {
  const path = fileURLToPath(new URL(`../data/set-mechanics/${setCode}.json`, import.meta.url))
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function applyNamedMechanics(cards, definitions) {
  if (definitions.length === 0) return cards
  return cards.map(card => {
    const matched = definitions.filter(def => new RegExp(def.pattern, def.flags).test(card[def.field] || ''))
    if (matched.length === 0) return card
    return { ...card, keywords: [...(card.keywords || []), ...matched.map(m => m.name)] }
  })
}
