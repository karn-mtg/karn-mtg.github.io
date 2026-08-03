import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { colorKey } from './util.mjs'
import { poissonAtLeast } from './poisson.mjs'

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

/** Optional, hand-curated official archetypes for a set (sourced from a WotC prerelease/preview article), analogous to data/set-mechanics/<code>.json. */
export function loadArchetypeDefs(setCode) {
  const path = fileURLToPath(new URL(`../data/set-archetypes/${setCode}.json`, import.meta.url))
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf-8'))
}

function isSubsetColorIdentity(colorIdentity, archColorSet) {
  return colorIdentity.every(c => archColorSet.has(c))
}

/**
 * Cross-checks WotC's stated archetypes (feature.md: "go against the
 * official combination... which are real feasible and which ones are hard
 * to go with") against our own data along two independent axes:
 *
 *  - Feasibility: given the set's actual rarity population and a standard
 *    6-pack sealed pool, what's the probability (Poisson approximation,
 *    since these are rare-event draws without replacement across packs) of
 *    opening enough of the archetype's color+mechanic cards to build it.
 *  - Quality: the average B.R.E.A.D. `overall` score of those support
 *    cards, vs. the set-wide average. An archetype can be statistically
 *    likely to come together (plenty of cheap commons) but still be weak,
 *    or the reverse (rare/mythic-gated, unlikely, but powerful when it
 *    lands) — the user specifically wants both signals, not just one.
 */
export function computeArchetypeAnalysis(mergedCards, byRarityTotals, manaCombos, archetypeDefs, sealedConfig) {
  if (archetypeDefs.length === 0) return []

  const setWideAvgQuality = round(
    mergedCards.reduce((sum, c) => sum + c.bread.overall, 0) / mergedCards.length
  )

  return archetypeDefs.map(def => {
    const archColors = colorKey(def.colors.split(''))
    const archColorSet = new Set(archColors.split(''))

    const supportCards = mergedCards.filter(c =>
      isSubsetColorIdentity(c.colorIdentity, archColorSet) && (c.keywords || []).includes(def.mechanic)
    )

    const byRarity = Object.fromEntries(RARITIES.map(r => [r, supportCards.filter(c => c.rarity === r).length]))

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

    const probabilityAtLeastOne = round(poissonAtLeast(expectedCount, 1) * 100)
    const probabilityPlayable = round(poissonAtLeast(expectedCount, sealedConfig.playableThreshold) * 100)

    const avgQuality = supportCards.length > 0
      ? round(supportCards.reduce((sum, c) => sum + c.bread.overall, 0) / supportCards.length)
      : 0

    const pairEntry = manaCombos.find(m => m.colors === archColors)
    const rankAmongPairs = pairEntry ? manaCombos.indexOf(pairEntry) + 1 : null

    const signalCards = [...supportCards]
      .filter(c => c.rarity === 'rare' || c.rarity === 'mythic')
      .sort((a, b) => b.bread.overall - a.bread.overall)
      .slice(0, 5)
      .map(c => c.name)

    const totalSupport = supportCards.length
    const isPlayable = probabilityPlayable >= 50
    const isQuality = avgQuality >= setWideAvgQuality

    let verdict
    if (totalSupport < sealedConfig.lowSupportThreshold) verdict = 'insufficient'
    else if (!isPlayable && !isQuality) verdict = 'dataDisagrees'
    else if (!isPlayable && isQuality) verdict = 'rareButStrong'
    else if (isPlayable && !isQuality) verdict = 'plentifulButWeak'
    else verdict = 'wellSupported'

    return {
      colors: archColors,
      name: def.name,
      mechanic: def.mechanic,
      description: def.description,
      supportCardCount: totalSupport,
      byRarity,
      expectedCount: round(expectedCount),
      probabilityAtLeastOne,
      probabilityPlayable,
      avgQuality,
      setWideAvgQuality,
      rankAmongPairs,
      totalPairs: manaCombos.length,
      signalCards,
      verdict,
    }
  })
}

function round(n) {
  return Math.round(n * 10) / 10
}
