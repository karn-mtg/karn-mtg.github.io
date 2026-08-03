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

const { wordCloud, topWords, wordColorMatrix } = computeWordCloud(raw)
const { mechanics, mechanicColorMatrix, mechanicsBySynergy } = computeMechanics(raw, topWords)
const synergyCombinations = computeSynergyCombinations(raw)
const creatureTypes = computeCreatureTypes(raw)

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
}

mkdirSync(outDir, { recursive: true })
writeFileSync(outPath, JSON.stringify(output, null, 2))

console.log(`Wrote ${outPath}`)
console.log(`  ${output.cardCount} cards, ${manaCombos.length} two-color pairs, top bomb pair: ${manaCombos[0]?.colors}`)
