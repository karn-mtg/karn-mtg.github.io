import { isCreature, isLand, isSubsetColorIdentity, byRarityCount } from './util.mjs'
import { poissonAtLeast } from './poisson.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'

/**
 * Can a given color pair actually fill a real 40-card sealed deck (~17 land,
 * 15+ creatures, 8+ spells)? Independent of any specific mechanic or theme —
 * this is the structural "do these colors have enough bodies and spells"
 * check shared by archetypeAnalysis.mjs (per named archetype) and
 * comboComposite.mjs (per generic color pair).
 */
export function computeDeckStructureFeasibility(mergedCards, colorSet, byRarityTotals, sealedConfig) {
  const colorPoolCards = mergedCards.filter(c =>
    isSubsetColorIdentity(c.colorIdentity, colorSet) && !isLand(c.typeLine)
  )
  const creaturePool = colorPoolCards.filter(c => isCreature(c.typeLine))
  const spellPool = colorPoolCards.filter(c => !isCreature(c.typeLine))

  const expectedCreatures = expectedSealedCount(byRarityCount(creaturePool), byRarityTotals, sealedConfig)
  const expectedSpells = expectedSealedCount(byRarityCount(spellPool), byRarityTotals, sealedConfig)

  const creatureFeasibility = round(poissonAtLeast(expectedCreatures, sealedConfig.deckCreatureTarget) * 100)
  const spellFeasibility = round(poissonAtLeast(expectedSpells, sealedConfig.deckSpellTarget) * 100)
  const deckFeasible = creatureFeasibility >= 50 && spellFeasibility >= 50

  return {
    deckFeasible,
    expectedCreatures: round(expectedCreatures),
    expectedSpells: round(expectedSpells),
    creatureFeasibility,
    spellFeasibility,
  }
}

function round(n) {
  return Math.round(n * 10) / 10
}
