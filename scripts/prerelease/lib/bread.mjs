import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { isCreature, stripReminderText } from './util.mjs'

const rules = JSON.parse(readFileSync(fileURLToPath(new URL('./bread-rules.json', import.meta.url)), 'utf-8'))

function sumPatternMatches(text, patterns) {
  let score = 0
  for (const { pattern, flags, weight } of patterns) {
    if (new RegExp(pattern, flags).test(text)) score += weight
  }
  return score
}

function numericStat(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

/** Bombs: big finishers. Scored off raw stats vs. mana cost, plus keyword bonuses. */
function scoreBomb(card) {
  const { minCmc, statVsCmcWeight, statVsCmcCap, keywordBonuses } = rules.bomb
  let score = 0

  if (isCreature(card.type_line) && card.cmc >= minCmc) {
    const power = numericStat(card.power)
    const toughness = numericStat(card.toughness)
    if (power !== null && toughness !== null) {
      const raw = (power + toughness - card.cmc) * statVsCmcWeight
      score += Math.max(0, Math.min(raw, statVsCmcCap))
    }
  }

  if (isCreature(card.type_line)) {
    for (const kw of card.keywords || []) {
      if (keywordBonuses[kw]) score += keywordBonuses[kw]
    }
  }

  return round(score)
}

/**
 * Removal: Destroy/Exile effects. Exile (permanent) > Destroy > temporary
 * "exile until X leaves" per feature.md's rank. The temporary-exile pattern
 * is checked first and its match text stripped so it doesn't also trigger
 * the plain "exile target" pattern.
 */
function scoreRemoval(card) {
  const text = stripReminderText(card.oracle_text)
  const { patterns } = rules.removal
  const tempExile = patterns.find(p => p.note?.includes('temporary exile'))
  const otherExilePatterns = patterns.filter(p => p.note?.includes('permanent exile'))
  const rest = patterns.filter(p => p !== tempExile && !otherExilePatterns.includes(p))

  let score = 0
  let workingText = text
  const tempRe = new RegExp(tempExile.pattern, tempExile.flags)
  if (tempRe.test(workingText)) {
    score += tempExile.weight
    workingText = workingText.replace(tempRe, '')
  }
  for (const p of otherExilePatterns) {
    if (new RegExp(p.pattern, p.flags).test(workingText)) score += p.weight
  }
  score += sumPatternMatches(text, rest)

  return round(score)
}

/** Evasion: unblockable/flying/trample/menace, ranked per feature.md, plus double-strike/lifelink combo bonus. */
function scoreEvasion(card) {
  if (!isCreature(card.type_line)) return 0
  const text = stripReminderText(card.oracle_text)
  let score = sumPatternMatches(text, rules.evasion.patterns.filter(p => p.pattern.includes("can't")))

  const keywordWeight = { flying: 3, trample: 2, menace: 1 }
  for (const kw of card.keywords || []) {
    const w = keywordWeight[kw.toLowerCase()]
    if (w) score += w
  }

  const hasEvasion = score > 0
  if (hasEvasion) {
    for (const [kw, bonus] of Object.entries(rules.evasion.comboBonuses)) {
      if ((card.keywords || []).includes(kw)) score += bonus
    }
  }

  return round(score)
}

/** Aggro: reach-the-face effects, pump, and haste/double-strike/first-strike keywords. */
function scoreAggro(card) {
  const text = stripReminderText(card.oracle_text)
  let score = sumPatternMatches(text, rules.aggro.patterns)
  for (const kw of card.keywords || []) {
    if (rules.aggro.keywordBonuses[kw]) score += rules.aggro.keywordBonuses[kw]
  }
  return round(score)
}

/** Diversity: card advantage, life gain, ramp — the "good filler" bucket. */
function scoreDiversity(card) {
  const text = stripReminderText(card.oracle_text)
  return round(sumPatternMatches(text, rules.diversity.patterns))
}

function round(n) {
  return Math.round(n * 10) / 10
}

export function scoreCardBread(card) {
  const bomb = scoreBomb(card)
  const removal = scoreRemoval(card)
  const evasion = scoreEvasion(card)
  const aggro = scoreAggro(card)
  const diversity = scoreDiversity(card)
  const overall = round(bomb + removal + evasion + aggro + diversity)

  const categoryScores = { bomb, removal, evasion, aggro, diversity }
  const tags = Object.entries(categoryScores)
    .filter(([, v]) => v >= rules.tagThreshold)
    .map(([k]) => k)
  if (tags.length === 0) tags.push('filler')

  return { ...categoryScores, overall, tags }
}
