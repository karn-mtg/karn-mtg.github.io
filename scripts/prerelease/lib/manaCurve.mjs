import { colorBucket, isCreature, TWO_COLOR_PAIRS } from './util.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

const CMC_BUCKETS = ['0', '1', '2', '3', '4', '5', '6+']
const COLOR_BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']
const PAIRS = TWO_COLOR_PAIRS

// Rough target curve for a 40-card sealed deck running ~15-17 creatures —
// standard limited guidance (light at 1-2, peak at 3, tapering after 4).
// Used only as a fixed yardstick for the curve-fit comparison below, not a
// literal deckbuilding prescription.
const TARGET_CURVE = { '2': 4, '3': 5, '4': 4, '5': 2, '6+': 1 }

function cmcBucket(cmc) {
  return cmc >= 6 ? '6+' : String(Math.round(cmc))
}

function emptyCounts() {
  return Object.fromEntries(CMC_BUCKETS.map(b => [b, 0]))
}

function round(n) {
  return Math.round(n * 10) / 10
}

/** Creature count by CMC bucket, per color — the "where does each color's curve thin out" view. */
export function computeManaCurveByColor(cards) {
  const byColor = Object.fromEntries(COLOR_BUCKETS.map(c => [c, emptyCounts()]))
  for (const card of cards) {
    if (!isCreature(card.type_line)) continue
    byColor[colorBucket(card.color_identity)][cmcBucket(card.cmc)]++
  }
  return COLOR_BUCKETS.map(color => ({
    color,
    counts: byColor[color],
    total: Object.values(byColor[color]).reduce((a, b) => a + b, 0),
  }))
}

/**
 * For each 2-color pair, the *expected* number of playable creatures
 * (identity subset of the pair, including colorless) you'd actually open
 * across a 6-pack sealed pool at each curve slot — not the full-set count,
 * which is always far bigger than a 16-card target and saturates to 100%
 * for every pair. Reuses expectedSealedCount (same hypergeometric-style
 * model archetypeAnalysis.mjs/crossCardSynergy.mjs already use) so this is
 * a real "can you actually assemble this curve from one pool" signal, not
 * just "does the design support it somewhere in 193 cards."
 */
export function computeCurveFitByPair(cards, byRarityTotals, sealedConfig) {
  const targetKeys = Object.keys(TARGET_CURVE)
  const targetSum = targetKeys.reduce((a, k) => a + TARGET_CURVE[k], 0)

  return PAIRS.map(pair => {
    const [c1, c2] = pair.split('')
    const byRarityByBucket = Object.fromEntries(CMC_BUCKETS.map(b => [b, Object.fromEntries(RARITIES.map(r => [r, 0]))]))
    for (const card of cards) {
      if (!isCreature(card.type_line)) continue
      const identity = card.color_identity || []
      if (!identity.every(c => c === c1 || c === c2)) continue
      if (RARITIES.includes(card.rarity)) byRarityByBucket[cmcBucket(card.cmc)][card.rarity]++
    }
    const expected = Object.fromEntries(
      CMC_BUCKETS.map(b => [b, round(expectedSealedCount(byRarityByBucket[b], byRarityTotals, sealedConfig))])
    )
    const coverageSum = targetKeys.reduce((a, k) => a + Math.min(expected[k], TARGET_CURVE[k]), 0)
    return {
      colors: pair,
      expected,
      curveFitPercent: round((coverageSum / targetSum) * 100),
    }
  }).sort((a, b) => b.curveFitPercent - a.curveFitPercent)
}
