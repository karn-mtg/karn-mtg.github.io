#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { computeColorStats } from './lib/colorStats.mjs'
import { scoreCardBread } from './lib/bread.mjs'
import { computeManaCombos } from './lib/manaCombos.mjs'
import { computeWordCloud } from './lib/wordCloud.mjs'
import { computeMechanics } from './lib/mechanics.mjs'
import { computeSynergyCombinations } from './lib/combinationScore.mjs'
import { computeCreatureTypes } from './lib/creatureTypes.mjs'
import { loadNamedMechanics, applyNamedMechanics } from './lib/setMechanics.mjs'
import { loadArchetypeDefs, computeArchetypeAnalysis } from './lib/archetypeAnalysis.mjs'
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

const raw = JSON.parse(readFileSync(cachePath, 'utf-8'))

const colorStats = computeColorStats(raw)

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

const manaCombos = computeManaCombos(cardsWithBread)

const bestCards = [...cardsWithBread]
  .sort((a, b) => b.bread.overall - a.bread.overall)
  .slice(0, 15)
  .map(c => c.name)

const namedMechanics = loadNamedMechanics(setCode)
const cardsWithNamedMechanics = applyNamedMechanics(raw, namedMechanics)
if (namedMechanics.length > 0) {
  console.log(`  applied ${namedMechanics.length} curated named mechanics from data/set-mechanics/${setCode}.json`)
}

const { wordCloud, topWords, wordColorMatrix } = computeWordCloud(raw)
const { mechanics, mechanicColorMatrix, mechanicsBySynergy } = computeMechanics(cardsWithNamedMechanics, topWords, namedMechanics)
const synergyCombinations = computeSynergyCombinations(cardsWithNamedMechanics)
const creatureTypes = computeCreatureTypes(raw)

const breadByOracleId = new Map(cardsWithBread.map(c => [c.oracleId, c]))
const mergedCards = cardsWithNamedMechanics.map(card => ({
  name: card.name,
  colorIdentity: card.color_identity || [],
  rarity: card.rarity,
  keywords: card.keywords || [],
  bread: breadByOracleId.get(card.oracle_id)?.bread ?? { overall: 0 },
}))

const archetypeDefs = loadArchetypeDefs(setCode)
const archetypeAnalysis = computeArchetypeAnalysis(mergedCards, colorStats.byRarity, manaCombos, archetypeDefs, sealedConfig)
if (archetypeDefs.length > 0) {
  console.log(`  applied ${archetypeDefs.length} curated official archetypes from data/set-archetypes/${setCode}.json`)
}

const output = {
  setCode,
  generatedAt: new Date().toISOString(),
  cardCount: colorStats.cardCount,
  colorStats,
  cards: cardsWithBread,
  bestCards,
  manaCombos,
  wordCloud,
  topWords,
  wordColorMatrix,
  mechanics,
  mechanicColorMatrix,
  mechanicsBySynergy,
  synergyCombinations,
  creatureTypes,
  archetypeAnalysis,
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, JSON.stringify(output, null, 2))

console.log(`Wrote ${outPath}`)
console.log(`  ${output.cardCount} cards, ${manaCombos.length} two-color pairs, top bomb pair: ${manaCombos[0]?.colors}`)
