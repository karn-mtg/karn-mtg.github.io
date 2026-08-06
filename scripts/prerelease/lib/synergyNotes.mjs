import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

/**
 * Same-card keyword co-occurrence (combinationScore.mjs) can't tell a real
 * rules-level interaction (Ferocious checking power 4+ synergizing with a
 * +X/+X pump) from pure coincidence (an Adventure card whose spell side
 * happens to mill — Adventure is a casting-timing mechanic with no
 * functional link to Mill). `data/set-synergy-notes/<setCode>.json` is an
 * optional, hand-curated verdict per candidate pair, authored by grounding
 * each pair in the actual comprehensive rules text (via the karn rules MCP
 * tools) rather than guessing from co-print frequency alone.
 */
export function loadSynergyNotes(setCode) {
  const path = fileURLToPath(new URL(`../data/set-synergy-notes/${setCode}.json`, import.meta.url))
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function pairKey(mechanics) {
  return [...mechanics].sort().join('|')
}

export function applySynergyNotes(combinations, notes) {
  const byPair = new Map(notes.map(n => [pairKey(n.mechanics), n]))
  return combinations.map(combo => {
    const note = byPair.get(pairKey(combo.mechanics))
    return note
      ? { ...combo, verdict: note.verdict, mechanism: note.mechanism }
      : { ...combo, verdict: 'unclear' }
  })
}

const VERDICT_RANK = { confirmed: 0, unclear: 1, coincidental: 2 }

export function rankBySynergyVerdict(combinations) {
  return [...combinations].sort((a, b) => {
    const rankDiff = VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict]
    if (rankDiff !== 0) return rankDiff
    return b.count - a.count
  })
}
