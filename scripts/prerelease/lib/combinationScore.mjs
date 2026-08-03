/**
 * Top synergy combinations: mechanic pairs that co-occur on the same card
 * most often, per feature.md's "table with the top combinations based on
 * the interaction/synergy metric". A high co-occurrence count means the
 * set is deliberately pairing those two mechanics together on the same
 * cards, which is a stronger signal than either mechanic alone.
 */
export function computeSynergyCombinations(cards, { topN = 10, minCount = 2 } = {}) {
  const pairCounts = new Map()
  const pairExamples = new Map()

  for (const card of cards) {
    const keywords = [...new Set(card.keywords || [])].sort()
    for (let i = 0; i < keywords.length; i++) {
      for (let j = i + 1; j < keywords.length; j++) {
        const key = `${keywords[i]}|${keywords[j]}`
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1)
        if (!pairExamples.has(key)) pairExamples.set(key, [])
        const examples = pairExamples.get(key)
        if (examples.length < 3) examples.push(card.name)
      }
    }
  }

  return [...pairCounts.entries()]
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([key, count]) => {
      const [a, b] = key.split('|')
      return { mechanics: [a, b], count, examples: pairExamples.get(key) }
    })
}
