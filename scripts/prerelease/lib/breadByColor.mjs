import { colorBucket } from './util.mjs'

const COLOR_BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']
const CATEGORIES = ['bomb', 'removal', 'evasion', 'aggro', 'diversity', 'overall']

/**
 * Average B.R.E.A.D. score per color bucket — refactor.md: "introduce where
 * we have more of each BREAD per color." Answers "why is this color the
 * strongest" (backs AtAGlance's color-distribution callout) and feeds the
 * dedicated BREAD-by-color breakdown in the B.R.E.A.D. block.
 */
export function computeBreadByColor(cardsWithBread) {
  const totals = Object.fromEntries(COLOR_BUCKETS.map(b => [b, { count: 0, ...Object.fromEntries(CATEGORIES.map(c => [c, 0])) }]))

  for (const card of cardsWithBread) {
    const bucket = colorBucket(card.colorIdentity)
    const entry = totals[bucket]
    entry.count++
    for (const cat of CATEGORIES) entry[cat] += card.bread[cat]
  }

  return COLOR_BUCKETS.map(color => {
    const entry = totals[color]
    const avg = Object.fromEntries(CATEGORIES.map(cat => [cat, entry.count > 0 ? round(entry[cat] / entry.count) : 0]))
    return { color, cardCount: entry.count, ...avg }
  })
}

function round(n) {
  return Math.round(n * 10) / 10
}
