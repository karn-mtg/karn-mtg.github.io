#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { computeColorStats } from './lib/colorStats.mjs'
import { scoreCardBread } from './lib/bread.mjs'
import { computeManaCombos } from './lib/manaCombos.mjs'
import { computeWordCloud } from './lib/wordCloud.mjs'
import { computeMechanics } from './lib/mechanics.mjs'
import { computeSynergyCombinations } from './lib/combinationScore.mjs'
import { loadSynergyNotes, applySynergyNotes, rankBySynergyVerdict } from './lib/synergyNotes.mjs'
import { computeCreatureTypes } from './lib/creatureTypes.mjs'
import { computeMechanicsByColorPair } from './lib/mechanicsByColorPair.mjs'
import { loadNamedMechanics, applyNamedMechanics } from './lib/setMechanics.mjs'
import { loadArchetypeDefs, computeArchetypeAnalysis } from './lib/archetypeAnalysis.mjs'
import { computeCrossCardSynergies } from './lib/crossCardSynergy.mjs'
import { computeBreadByColor } from './lib/breadByColor.mjs'
import { computeBoosterOdds } from './lib/pullChance.mjs'
import sealedConfig from './lib/sealed-config.json' with { type: 'json' }

const setCode = process.argv[2]
if (!setCode) {
  console.error('Usage: node scripts/prerelease/analyze.mjs <setCode>')
  process.exit(1)
}

const root = fileURLToPath(new URL('../..', import.meta.url))
const cachePath = `${root}/scripts/prerelease/.cache/${setCode}.raw.json`
const outDir = `${root}/src/content/prerelease-data`
const outPath = `${outDir}/${setCode}.json`

const rawAll = JSON.parse(readFileSync(cachePath, 'utf-8'))

const namedMechanics = loadNamedMechanics(setCode)
if (namedMechanics.length > 0) {
  console.log(`  applied ${namedMechanics.length} curated named mechanics from data/set-mechanics/${setCode}.json`)
}
const synergyNotes = loadSynergyNotes(setCode)
if (synergyNotes.length > 0) {
  console.log(`  applied ${synergyNotes.length} curated synergy-validity notes from data/set-synergy-notes/${setCode}.json`)
}
const archetypeDefs = loadArchetypeDefs(setCode)
if (archetypeDefs.length > 0) {
  console.log(`  applied ${archetypeDefs.length} curated official archetypes from data/set-archetypes/${setCode}.json`)
}

/**
 * Every rarity-sensitive computation runs once for the full card pool and
 * once for a commons/uncommons-only pool (the "Remove Rares/Mythics" toggle
 * — refactor.md), each with its own colorStats totals as the ratio
 * denominator, not just a filtered numerator over the full-set totals.
 */
function computeForPool(raw) {
  const colorStats = computeColorStats(raw)
  const byRarityTotals = colorStats.byRarity

  const cardsWithBread = raw.map(card => ({
    name: card.name,
    oracleId: card.oracle_id,
    manaCost: card.mana_cost || '',
    cmc: card.cmc,
    typeLine: card.type_line,
    colors: card.colors || [],
    colorIdentity: card.color_identity || [],
    rarity: card.rarity,
    image: card.image_normal,
    bread: scoreCardBread(card),
  }))

  const manaCombos = computeManaCombos(cardsWithBread, byRarityTotals, sealedConfig)

  const bestCards = [...cardsWithBread]
    .sort((a, b) => b.bread.overall - a.bread.overall)
    .slice(0, 15)
    .map(c => c.name)

  const cardsWithNamedMechanics = applyNamedMechanics(raw, namedMechanics)

  const { wordCloud, topWords, wordColorMatrix } = computeWordCloud(raw, byRarityTotals, sealedConfig)
  const { mechanics, mechanicColorMatrix, mechanicsBySynergy } = computeMechanics(cardsWithNamedMechanics, topWords, namedMechanics, byRarityTotals, sealedConfig)
  const creatureTypes = computeCreatureTypes(raw, byRarityTotals, sealedConfig)

  const breadByOracleId = new Map(cardsWithBread.map(c => [c.oracleId, c]))

  const rawSynergyCombinations = computeSynergyCombinations(cardsWithNamedMechanics, { topN: 20 })
  const synergyCombinations = rankBySynergyVerdict(applySynergyNotes(rawSynergyCombinations, synergyNotes)).slice(0, 10)

  const mechanicsByColorPair = computeMechanicsByColorPair(
    cardsWithNamedMechanics,
    new Map(cardsWithBread.map(c => [c.oracleId, c.bread]))
  )

  const mergedCards = cardsWithNamedMechanics.map(card => ({
    name: card.name,
    colorIdentity: card.color_identity || [],
    rarity: card.rarity,
    keywords: card.keywords || [],
    bread: breadByOracleId.get(card.oracle_id)?.bread ?? { overall: 0 },
  }))

  const archetypeAnalysis = computeArchetypeAnalysis(mergedCards, byRarityTotals, manaCombos, archetypeDefs, sealedConfig, mechanicsByColorPair)

  const oracleTextByOracleId = new Map(raw.map(c => [c.oracle_id, c.oracle_text]))
  const cardsWithText = cardsWithBread.map(c => ({ ...c, oracleText: oracleTextByOracleId.get(c.oracleId) || '' }))
  const crossCardSynergies = computeCrossCardSynergies(cardsWithText, byRarityTotals, sealedConfig)

  const breadByColor = computeBreadByColor(cardsWithBread)
  const boosterOdds = computeBoosterOdds(byRarityTotals, sealedConfig)

  return {
    colorStats,
    cardsWithBread,
    bestCards,
    manaCombos,
    wordCloud,
    topWords,
    wordColorMatrix,
    mechanics,
    mechanicColorMatrix,
    mechanicsBySynergy,
    synergyCombinations,
    crossCardSynergies,
    creatureTypes,
    archetypeAnalysis,
    breadByColor,
    boosterOdds,
  }
}

const isCommonsOnly = card => card.rarity !== 'rare' && card.rarity !== 'mythic'

const allPool = computeForPool(rawAll)
const commonsOnlyPool = computeForPool(rawAll.filter(isCommonsOnly))

const dual = (key) => ({ all: allPool[key], commonsOnly: commonsOnlyPool[key] })

const output = {
  setCode,
  generatedAt: new Date().toISOString(),
  cardCount: allPool.colorStats.cardCount,
  colorStats: dual('colorStats'),
  cards: allPool.cardsWithBread,
  bestCards: dual('bestCards'),
  manaCombos: dual('manaCombos'),
  wordCloud: dual('wordCloud'),
  topWords: dual('topWords'),
  wordColorMatrix: dual('wordColorMatrix'),
  mechanics: dual('mechanics'),
  mechanicColorMatrix: dual('mechanicColorMatrix'),
  mechanicsBySynergy: dual('mechanicsBySynergy'),
  synergyCombinations: dual('synergyCombinations'),
  crossCardSynergies: dual('crossCardSynergies'),
  creatureTypes: dual('creatureTypes'),
  archetypeAnalysis: dual('archetypeAnalysis'),
  breadByColor: dual('breadByColor'),
  boosterOdds: dual('boosterOdds'),
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, JSON.stringify(output, null, 2))

console.log(`Wrote ${outPath}`)
console.log(`  ${output.cardCount} cards, ${allPool.manaCombos.length} two-color pairs, top bomb pair: ${allPool.manaCombos[0]?.colors}`)
