import { colorKey } from './util.mjs'

/**
 * Ranks 2-color identity pairs by aggregate B.R.E.A.D. strength, so an
 * article can call out "the strongest color pairs for bombs" per feature.md.
 * Mono-color and 3+ color identities are excluded — this is specifically a
 * 2-color "mana combination" ranking.
 */
export function computeManaCombos(cardsWithBread) {
  const byPair = new Map()

  for (const card of cardsWithBread) {
    const identity = card.colorIdentity || []
    if (identity.length !== 2) continue
    const key = colorKey(identity)
    if (!byPair.has(key)) byPair.set(key, { colors: key, cardCount: 0, bombTotal: 0, overallTotal: 0, topCards: [] })
    const entry = byPair.get(key)
    entry.cardCount++
    entry.bombTotal += card.bread.bomb
    entry.overallTotal += card.bread.overall
    entry.topCards.push({ name: card.name, bomb: card.bread.bomb, overall: card.bread.overall })
  }

  return [...byPair.values()]
    .map(entry => ({
      colors: entry.colors,
      cardCount: entry.cardCount,
      avgBomb: round(entry.bombTotal / entry.cardCount),
      avgOverall: round(entry.overallTotal / entry.cardCount),
      topCards: entry.topCards.sort((a, b) => b.bomb - a.bomb).slice(0, 5).map(c => c.name),
    }))
    .sort((a, b) => b.avgBomb - a.avgBomb)
}

function round(n) {
  return Math.round(n * 10) / 10
}
