import { poissonAtLeast } from './poisson.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'

/**
 * "Pull Chance" for a rank-table row (a word, mechanic, creature type, mana
 * combo, ...): chance a 6-pack sealed pool opens at least one card matching
 * that row, given how many matching cards exist at each rarity vs. the
 * pool's own rarity totals. Thin wrapper around the existing
 * expectedSealedCount + poissonAtLeast machinery so every rank table can
 * show the same stat without re-deriving it.
 */
export function pullChanceForRow(byRarity, byRarityTotals, sealedConfig) {
  const expectedCount = expectedSealedCount(byRarity, byRarityTotals, sealedConfig)
  return round(poissonAtLeast(expectedCount, 1) * 100)
}

/**
 * Chance of opening 2+ copies of the *same* card at a given rarity — a
 * birthday-collision approximation: draw `slotsOpened` cards uniformly at
 * random (with replacement, since packs are drawn from a large, refreshed
 * print run relative to a single 6-pack pool) from `uniqueCount` distinct
 * card names; P(at least one collision) = 1 - product of (1 - i/uniqueCount)
 * for i in [0, slotsOpened). Distinct from pullChanceForRow's "at least one
 * match" question — this is "how likely are you to see a repeat."
 */
export function duplicateOdds(uniqueCount, slotsOpened) {
  if (uniqueCount <= 0 || slotsOpened <= 1) return 0
  let noCollisionProbability = 1
  for (let i = 0; i < slotsOpened; i++) {
    noCollisionProbability *= (uniqueCount - i) / uniqueCount
    if (noCollisionProbability <= 0) return 100
  }
  return round((1 - noCollisionProbability) * 100)
}

/** Total slots opened at a rarity across a 6-pack sealed pool, splitting the shared rare/mythic slot by mythicRate. */
export function slotsOpenedForRarity(rarity, sealedConfig) {
  if (rarity === 'common' || rarity === 'uncommon') {
    return sealedConfig.packsOpened * sealedConfig.slotsPerPack[rarity]
  }
  if (rarity === 'rare') {
    return sealedConfig.packsOpened * sealedConfig.slotsPerPack.rare * (1 - sealedConfig.mythicRate)
  }
  if (rarity === 'mythic') {
    return sealedConfig.packsOpened * sealedConfig.slotsPerPack.rare * sealedConfig.mythicRate
  }
  return 0
}

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

/** Per-rarity booster odds for the intro's "chance of a repeated card" stat block. */
export function computeBoosterOdds(byRarityTotals, sealedConfig) {
  return Object.fromEntries(RARITIES.map(rarity => {
    const uniqueCount = byRarityTotals[rarity] || 0
    const slotsOpened = round(slotsOpenedForRarity(rarity, sealedConfig))
    return [rarity, { uniqueCount, slotsOpened, duplicateChance: duplicateOdds(uniqueCount, slotsOpened) }]
  }))
}

function round(n) {
  return Math.round(n * 10) / 10
}
