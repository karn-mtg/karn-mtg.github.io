import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { colorKey, isSubsetColorIdentity } from './util.mjs'
import { poissonAtLeast } from './poisson.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'
import { computeDeckStructureFeasibility } from './deckStructure.mjs'

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

/** Optional, hand-curated official archetypes for a set (sourced from a WotC prerelease/preview article), analogous to data/set-mechanics/<code>.json. */
export function loadArchetypeDefs(setCode) {
  const path = fileURLToPath(new URL(`../data/set-archetypes/${setCode}.json`, import.meta.url))
  if (!existsSync(path)) return []
  return JSON.parse(readFileSync(path, 'utf-8'))
}

/**
 * Cross-checks WotC's stated archetypes (feature.md: "go against the
 * official combination... which are real feasible and which ones are hard
 * to go with") against our own data along three independent axes:
 *
 *  - Deck feasibility: can these two colors actually fill a real 40-card
 *    deck (~17 land / 15 creatures / 8 spells), independent of the named
 *    mechanic — a color pair can be "insufficient" on its own merits even
 *    before asking whether the flavor theme shows up.
 *  - Theme feasibility: given the set's actual rarity population and a
 *    standard 6-pack sealed pool, what's the probability (Poisson
 *    approximation, since these are rare-event draws without replacement
 *    across packs) of opening enough of the archetype's color+mechanic
 *    cards to build it.
 *  - Quality: the average B.R.E.A.D. `overall` score of those support
 *    cards, vs. the set-wide average. An archetype can be statistically
 *    likely to come together (plenty of cheap commons) but still be weak,
 *    or the reverse (rare/mythic-gated, unlikely, but powerful when it
 *    lands) — the user specifically wants both signals, not just one.
 */
const WEAK_VERDICTS = new Set(['insufficient', 'themeThin', 'dataDisagrees', 'plentifulButWeak'])
const MIN_ALTERNATIVE_SUPPORT = 3

function findAlternativeSignal(archColors, ownMechanic, mechanicsByColorPair) {
  const candidates = mechanicsByColorPair
    .filter(m => m.colors === archColors && m.mechanic !== ownMechanic && m.cardCount >= MIN_ALTERNATIVE_SUPPORT)
    .sort((a, b) => (b.cardCount * b.avgOverall) - (a.cardCount * a.avgOverall))

  if (candidates.length === 0) return null
  const { mechanic, cardCount, avgOverall } = candidates[0]
  return { mechanic, cardCount, avgOverall }
}

export function computeArchetypeAnalysis(mergedCards, byRarityTotals, manaCombos, archetypeDefs, sealedConfig, mechanicsByColorPair = []) {
  if (archetypeDefs.length === 0) return []

  const setWideAvgQuality = round(
    mergedCards.reduce((sum, c) => sum + c.bread.overall, 0) / mergedCards.length
  )

  return archetypeDefs.map(def => {
    const archColors = colorKey(def.colors.split(''))
    const archColorSet = new Set(archColors.split(''))

    const { deckFeasible, expectedCreatures, expectedSpells, creatureFeasibility, spellFeasibility } =
      computeDeckStructureFeasibility(mergedCards, archColorSet, byRarityTotals, sealedConfig)

    const supportCards = mergedCards.filter(c =>
      isSubsetColorIdentity(c.colorIdentity, archColorSet) && (c.keywords || []).includes(def.mechanic)
    )

    const byRarity = Object.fromEntries(RARITIES.map(r => [r, supportCards.filter(c => c.rarity === r).length]))

    const expectedCount = expectedSealedCount(byRarity, byRarityTotals, sealedConfig)

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
    if (!deckFeasible) verdict = 'insufficient'
    else if (totalSupport < sealedConfig.lowSupportThreshold) verdict = 'themeThin'
    else if (!isPlayable && !isQuality) verdict = 'dataDisagrees'
    else if (!isPlayable && isQuality) verdict = 'rareButStrong'
    else if (isPlayable && !isQuality) verdict = 'plentifulButWeak'
    else verdict = 'wellSupported'

    const alternativeSignal = WEAK_VERDICTS.has(verdict)
      ? findAlternativeSignal(archColors, def.mechanic, mechanicsByColorPair)
      : null

    return {
      colors: archColors,
      name: def.name,
      mechanic: def.mechanic,
      description: def.description,
      deckFeasible,
      expectedCreatures,
      expectedSpells,
      creatureFeasibility,
      spellFeasibility,
      deckCreatureTarget: sealedConfig.deckCreatureTarget,
      deckSpellTarget: sealedConfig.deckSpellTarget,
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
      alternativeSignal,
    }
  })
}

function round(n) {
  return Math.round(n * 10) / 10
}
