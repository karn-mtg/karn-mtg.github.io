import { colorBucket, isCreature } from './util.mjs'

const BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']

/**
 * Card quantity + color-identity distribution, split by creature/non-creature
 * and by rarity, per feature.md's "General Information" section.
 */
export function computeColorStats(cards) {
  const byColor = Object.fromEntries(BUCKETS.map(b => [b, { total: 0, creature: 0, nonCreature: 0 }]))
  const byRarity = {}

  for (const card of cards) {
    const bucket = colorBucket(card.color_identity)
    byColor[bucket].total++
    if (isCreature(card.type_line)) byColor[bucket].creature++
    else byColor[bucket].nonCreature++

    const rarity = card.rarity || 'unknown'
    byRarity[rarity] = (byRarity[rarity] || 0) + 1
  }

  return {
    cardCount: cards.length,
    byColor,
    byRarity,
  }
}
