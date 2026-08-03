import { colorBucket, colorKey } from './util.mjs'

const COLOR_BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']
const SINGLE_COLORS = ['W', 'U', 'B', 'R', 'G']
const PAIRS = ['WU', 'WB', 'WR', 'WG', 'UB', 'UR', 'UG', 'BR', 'BG', 'RG']

/**
 * Double-faced cards can have a type line like "Saga // Creature — Human
 * Wizard", so we split on faces first and only take the subtype half of
 * whichever face(s) are actually typed Creature — otherwise the other
 * face's supertype/maintype words ("Saga", "Legendary", "//") leak in as
 * fake subtypes.
 */
function parseSubtypes(typeLine) {
  const subtypes = []
  for (const face of typeLine.split('//')) {
    const [mainPart, subPart] = face.split('—')
    if (subPart === undefined) continue
    if (!/\bCreature\b/.test(mainPart)) continue
    subtypes.push(...subPart.trim().split(/\s+/).filter(Boolean))
  }
  return subtypes
}

/**
 * Creature subtype ("tribal") distribution — how many creatures of each
 * type (Human, Goblin, Dragon, ...) exist and which colors/guilds they
 * cluster in, plus "Kindred signals": the single most color-concentrated
 * tribe in each color and in each two-color guild, mirroring how limited
 * sets print signpost cards to flag a supported tribal archetype.
 */
export function computeCreatureTypes(cards, { topSize = 15, minSignalCount = 3, minPairSignalCount = 2 } = {}) {
  const frequency = new Map()
  const byColor = new Map()
  const byPair = new Map()

  for (const card of cards) {
    const subtypesForCard = parseSubtypes(card.type_line)
    if (subtypesForCard.length === 0) continue
    const identity = card.color_identity || []
    const bucket = colorBucket(identity)
    const pairKey = identity.length === 2 ? colorKey(identity) : null

    for (const subtype of subtypesForCard) {
      frequency.set(subtype, (frequency.get(subtype) || 0) + 1)
      if (!byColor.has(subtype)) byColor.set(subtype, Object.fromEntries(COLOR_BUCKETS.map(b => [b, 0])))
      byColor.get(subtype)[bucket]++

      if (pairKey) {
        if (!byPair.has(subtype)) byPair.set(subtype, Object.fromEntries(PAIRS.map(p => [p, 0])))
        byPair.get(subtype)[pairKey]++
      }
    }
  }

  const ranked = [...frequency.entries()].sort((a, b) => b[1] - a[1])
  const subtypes = ranked.slice(0, topSize).map(([subtype, count]) => ({ subtype, count, byColor: byColor.get(subtype) }))

  // Ranks by concentration (share of the tribe's total that lives in this
  // color/guild), not raw count — otherwise a globally common tribe like
  // Human would "win" every color just by being abundant everywhere.
  const kindredSignals = SINGLE_COLORS.map(color => {
    let best = null
    for (const [subtype, total] of frequency.entries()) {
      const colorCount = byColor.get(subtype)[color]
      if (colorCount < minSignalCount) continue
      const concentration = colorCount / total
      if (!best || concentration > best.concentration) best = { color, subtype, count: colorCount, concentration }
    }
    return best ? { ...best, concentration: Math.round(best.concentration * 100) } : null
  }).filter(Boolean)

  const kindredSignalsByPair = PAIRS.map(pair => {
    let best = null
    for (const [subtype, total] of frequency.entries()) {
      const pairCounts = byPair.get(subtype)
      const pairCount = pairCounts ? pairCounts[pair] : 0
      if (pairCount < minPairSignalCount) continue
      const concentration = pairCount / total
      if (!best || concentration > best.concentration) best = { colors: pair, subtype, count: pairCount, concentration }
    }
    return best ? { ...best, concentration: Math.round(best.concentration * 100) } : null
  }).filter(Boolean)

  return { subtypes, kindredSignals, kindredSignalsByPair }
}
