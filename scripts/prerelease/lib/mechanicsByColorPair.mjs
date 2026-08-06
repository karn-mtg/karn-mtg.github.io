const COLORS = ['W', 'U', 'B', 'R', 'G']

function allColorPairs() {
  const pairs = []
  for (let i = 0; i < COLORS.length; i++) {
    for (let j = i + 1; j < COLORS.length; j++) {
      pairs.push(COLORS[i] + COLORS[j])
    }
  }
  return pairs
}

function isSubsetOf(colorIdentity, pairSet) {
  return colorIdentity.every(c => pairSet.has(c))
}

/**
 * For every 2-color pair, ranks mechanics by how many cards buildable in
 * that pair (i.e. color identity is a subset of it — same population
 * archetypeAnalysis.mjs uses for its own supportCards, not just exact-gold
 * cards) carry each keyword, and those cards' average BREAD quality. Used to
 * suggest an alternative build-around mechanic when the official archetype
 * for a color pair tests weak — mechanicColorMatrix (mechanics.mjs) is too
 * coarse for this since it only buckets by single color/multi/C.
 */
export function computeMechanicsByColorPair(cardsWithNamedMechanics, breadByOracleId) {
  const results = []

  for (const colors of allColorPairs()) {
    const pairSet = new Set(colors)
    const byMechanic = new Map()

    for (const card of cardsWithNamedMechanics) {
      const identity = card.color_identity || []
      if (identity.length === 0 || !isSubsetOf(identity, pairSet)) continue
      const overall = breadByOracleId.get(card.oracle_id)?.overall ?? 0

      for (const mechanic of new Set(card.keywords || [])) {
        if (!byMechanic.has(mechanic)) byMechanic.set(mechanic, { cardCount: 0, overallTotal: 0 })
        const entry = byMechanic.get(mechanic)
        entry.cardCount++
        entry.overallTotal += overall
      }
    }

    for (const [mechanic, { cardCount, overallTotal }] of byMechanic) {
      results.push({ colors, mechanic, cardCount, avgOverall: round(overallTotal / cardCount) })
    }
  }

  return results
}

function round(n) {
  return Math.round(n * 10) / 10
}
