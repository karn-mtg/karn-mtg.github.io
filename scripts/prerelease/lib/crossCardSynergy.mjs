import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { stripReminderText } from './util.mjs'
import { poissonAtLeast } from './poisson.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'

const themes = JSON.parse(readFileSync(fileURLToPath(new URL('./synergy-themes.json', import.meta.url)), 'utf-8'))

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

function byRarityOf(cards) {
  return Object.fromEntries(RARITIES.map(r => [r, cards.filter(c => c.rarity === r).length]))
}

function topCards(cards) {
  return [...cards]
    .sort((a, b) => b.bread.overall - a.bread.overall)
    .slice(0, 5)
    .map(c => ({ name: c.name, colorIdentity: c.colorIdentity, manaCost: c.manaCost }))
}

/**
 * Real synergy in a card pool usually spans two different cards — a payoff
 * that triggers off an event, and separate, more common cards that generate
 * that event — not two mechanics stacked on one card (that's
 * combinationScore.mjs, a narrower and much rarer thing). For each evergreen
 * theme in synergy-themes.json, counts how many cards in the set are payoffs
 * vs. enablers, then reuses the same 6-pack sealed-pool Poisson approximation
 * archetypeAnalysis.mjs applies to a single archetype's support cards to ask:
 * how likely is a sealed pool to open at least one payoff AND a workable
 * handful of enablers for this theme? Ranked by that combined feasibility,
 * not by an invented quality blend, per the user's explicit ask ("which
 * synergies has more chance to appear in the sealed").
 */
export function computeCrossCardSynergies(cardsWithBread, byRarityTotals, sealedConfig) {
  const roleCountByCard = new Map()

  const results = themes.map(theme => {
    const payoffRe = new RegExp(theme.payoff.pattern, theme.payoff.flags)
    const enablerRe = new RegExp(theme.enabler.pattern, theme.enabler.flags)

    const payoffCards = []
    const enablerCards = []
    for (const card of cardsWithBread) {
      const text = stripReminderText(card.oracleText)
      const isPayoff = payoffRe.test(text)
      const isEnabler = enablerRe.test(text)
      if (isPayoff) payoffCards.push(card)
      if (isEnabler) enablerCards.push(card)
      if (isPayoff || isEnabler) {
        if (!roleCountByCard.has(card.name)) roleCountByCard.set(card.name, { card, themes: new Set() })
        roleCountByCard.get(card.name).themes.add(theme.name)
      }
    }

    const payoffByRarity = byRarityOf(payoffCards)
    const enablerByRarity = byRarityOf(enablerCards)

    const expectedPayoffCount = expectedSealedCount(payoffByRarity, byRarityTotals, sealedConfig)
    const expectedEnablerCount = expectedSealedCount(enablerByRarity, byRarityTotals, sealedConfig)

    const probabilityPayoff = round(poissonAtLeast(expectedPayoffCount, 1) * 100)
    const probabilityEnablers = round(poissonAtLeast(expectedEnablerCount, sealedConfig.playableThreshold) * 100)
    const comboScore = round((probabilityPayoff / 100) * (probabilityEnablers / 100) * 100)

    const unionCards = [...new Set([...payoffCards, ...enablerCards])]
    const avgQuality = unionCards.length > 0
      ? round(unionCards.reduce((sum, c) => sum + c.bread.overall, 0) / unionCards.length)
      : 0

    return {
      name: theme.name,
      description: theme.description,
      payoffCardCount: payoffCards.length,
      enablerCardCount: enablerCards.length,
      payoffByRarity,
      enablerByRarity,
      probabilityPayoff,
      probabilityEnablers,
      comboScore,
      avgQuality,
      topPayoffCards: topCards(payoffCards),
      topEnablerCards: topCards(enablerCards),
    }
  }).filter(r => r.payoffCardCount > 0).sort((a, b) => b.comboScore - a.comboScore)

  const multiRoleCards = [...roleCountByCard.values()]
    .filter(({ themes }) => themes.size >= 2)
    .sort((a, b) => b.themes.size - a.themes.size || b.card.bread.overall - a.card.bread.overall)
    .slice(0, 8)
    .map(({ card, themes }) => ({ name: card.name, colorIdentity: card.colorIdentity, manaCost: card.manaCost, themeCount: themes.size, themes: [...themes] }))

  return { synergies: results, multiRoleCards }
}

function round(n) {
  return Math.round(n * 10) / 10
}
