/**
 * Expected number of matching cards a player opens across a standard 6-pack
 * sealed pool, given how many matching cards exist at each rarity vs. the
 * set's total population at that rarity. Weights commons/uncommons by
 * packsOpened * slotsPerPack[rarity], and splits the single rare slot per
 * pack between rare/mythic by sealedConfig.mythicRate. Shared by
 * archetypeAnalysis.mjs (per-archetype support-card feasibility) and
 * crossCardSynergy.mjs (per-theme payoff/enabler feasibility).
 */
export function expectedSealedCount(byRarity, byRarityTotals, sealedConfig) {
  let expectedCount = 0

  for (const rarity of ['common', 'uncommon']) {
    const total = byRarityTotals[rarity]
    if (!total) continue
    expectedCount += sealedConfig.packsOpened * sealedConfig.slotsPerPack[rarity] * (byRarity[rarity] / total)
  }
  if (byRarityTotals.rare) {
    expectedCount += sealedConfig.packsOpened * sealedConfig.slotsPerPack.rare * (1 - sealedConfig.mythicRate) * (byRarity.rare / byRarityTotals.rare)
  }
  if (byRarityTotals.mythic) {
    expectedCount += sealedConfig.packsOpened * sealedConfig.slotsPerPack.rare * sealedConfig.mythicRate * (byRarity.mythic / byRarityTotals.mythic)
  }

  return expectedCount
}
