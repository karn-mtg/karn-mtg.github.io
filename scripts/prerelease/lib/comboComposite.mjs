import { computeDeckStructureFeasibility } from './deckStructure.mjs'
import { isLand, isSubsetColorIdentity, TWO_COLOR_PAIRS } from './util.mjs'

/**
 * Folds four independent signals into the mana-combo ranking, kept visible
 * as separate sub-scores rather than one opaque number (same principle as
 * archetypeAnalysis.mjs's verdict split):
 *
 *  - Raw Score ("Expected Quality"): not the old flat avgOverall over just
 *    the pair's *gold* cards (which broke down for pairs with zero gold
 *    cards, and undercounted "how deep is this pair" since it ignored mono
 *    and colorless cards entirely). Instead, for every card whose identity
 *    is a subset of the pair, weight its bread.overall by its own expected
 *    number of copies opened across a 6-pack pool (same per-rarity pack-odds
 *    math as expectedSealedCount, just applied per single card instead of a
 *    whole category), then sum. Rewards pool depth and quality together,
 *    and naturally favors commons you'll reliably open over a rare bomb
 *    you'll rarely see — without needing a separate "quantity" bonus term.
 *  - Curve Fit: curveFitByPair's existing creature-curve-shape percentage.
 *  - Pull Chance: computeDeckStructureFeasibility generalized to every
 *    pair (not just curated archetypes) — probability of opening enough
 *    raw volume (15+ creatures, 8+ spells) to fill a real deck. Distinct
 *    from manaCombos' existing `pullChance` field ("chance of opening >=1
 *    card"), which stays untouched.
 *  - Synergy: computeSynergyByColorPair's quality-weighted live-theme score,
 *    normalized relative to the strongest pair in this pool.
 *
 * Always scores all 10 canonical color pairs (TWO_COLOR_PAIRS), not just the
 * ones manaCombos happened to find a gold card for — a pair with zero gold
 * cards can still be a perfectly good pair built from mono/colorless cards,
 * and silently dropping it from the ranking hid that. Pairs with no gold
 * card fall back to zeroed gold-card stats (cardCount/avgBomb/avgOverall/
 * topCards/byRarity/pullChance) but still get real Curve Fit/Pull Chance/
 * Synergy/Raw Score, computed from the subset pool.
 *
 * Final Score is a weighted sum of the four (weights in sealedConfig so
 * tuning doesn't require a code change). Returns the list sorted by Final
 * Score descending (was sorted by avgBomb).
 */
const EMPTY_GOLD_STATS = {
  cardCount: 0,
  avgBomb: 0,
  avgOverall: 0,
  topCards: [],
  byRarity: { common: 0, uncommon: 0, rare: 0, mythic: 0 },
  pullChance: 0,
}

function expectedCopiesPerRarity(byRarityTotals, sealedConfig) {
  const { packsOpened, slotsPerPack, mythicRate } = sealedConfig
  return {
    common: byRarityTotals.common ? (packsOpened * slotsPerPack.common) / byRarityTotals.common : 0,
    uncommon: byRarityTotals.uncommon ? (packsOpened * slotsPerPack.uncommon) / byRarityTotals.uncommon : 0,
    rare: byRarityTotals.rare ? (packsOpened * slotsPerPack.rare * (1 - mythicRate)) / byRarityTotals.rare : 0,
    mythic: byRarityTotals.mythic ? (packsOpened * slotsPerPack.rare * mythicRate) / byRarityTotals.mythic : 0,
  }
}

function computeExpectedQuality(mergedCards, colorSet, expectedCopies) {
  return mergedCards.reduce((sum, c) => {
    if (isLand(c.typeLine) || !isSubsetColorIdentity(c.colorIdentity, colorSet)) return sum
    return sum + (expectedCopies[c.rarity] ?? 0) * c.bread.overall
  }, 0)
}

export function computeComboComposite(manaCombos, curveFitByPair, synergyByPair, mergedCards, byRarityTotals, sealedConfig) {
  const manaComboByColors = new Map(manaCombos.map(c => [c.colors, c]))
  const curveByColors = new Map(curveFitByPair.map(c => [c.colors, c]))
  const synergyByColors = new Map(synergyByPair.map(s => [s.colors, s]))
  const weights = sealedConfig.comboScoreWeights
  const expectedCopies = expectedCopiesPerRarity(byRarityTotals, sealedConfig)

  const pairExpectedQuality = TWO_COLOR_PAIRS.map(pair => ({
    pair,
    expectedQualityScore: round(computeExpectedQuality(mergedCards, new Set(pair.split('')), expectedCopies)),
  }))
  const maxExpectedQuality = Math.max(...pairExpectedQuality.map(p => p.expectedQualityScore), 1)
  const maxSynergyRaw = Math.max(...synergyByPair.map(s => s.synergyRawScore), 1)

  const enriched = pairExpectedQuality.map(({ pair, expectedQualityScore }) => {
    const colorSet = new Set(pair.split(''))
    const goldStats = manaComboByColors.get(pair) ?? { colors: pair, ...EMPTY_GOLD_STATS }
    const structure = computeDeckStructureFeasibility(mergedCards, colorSet, byRarityTotals, sealedConfig)
    const curve = curveByColors.get(pair)
    const synergy = synergyByColors.get(pair)

    const rawScorePercent = round((expectedQualityScore / maxExpectedQuality) * 100)
    const curveFitPercent = curve?.curveFitPercent ?? 0
    const deckPullChancePercent = round((structure.creatureFeasibility + structure.spellFeasibility) / 2)
    const synergyPercent = round(((synergy?.synergyRawScore ?? 0) / maxSynergyRaw) * 100)

    const finalScore = round(
      rawScorePercent * weights.raw +
      curveFitPercent * weights.curve +
      deckPullChancePercent * weights.pullChance +
      synergyPercent * weights.synergy
    )

    return {
      ...goldStats,
      colors: pair,
      expectedQualityScore,
      rawScorePercent,
      curveFitPercent,
      deckPullChancePercent,
      synergyPercent,
      synergyThemes: synergy?.themes ?? [],
      deckFeasible: structure.deckFeasible,
      finalScore,
    }
  })

  return enriched.sort((a, b) => b.finalScore - a.finalScore)
}

function round(n) {
  return Math.round(n * 10) / 10
}
