const COLOR_ORDER = ['W', 'U', 'B', 'R', 'G']

/** Strips Scryfall reminder text ("(...)") from oracle text. */
export function stripReminderText(text) {
  return (text || '').replace(/\([^)]*\)/g, '').trim()
}

/** Sorts a color array into WUBRG order and joins it, e.g. ["R","W"] -> "WR". */
export function colorKey(colors) {
  return [...colors].sort((a, b) => COLOR_ORDER.indexOf(a) - COLOR_ORDER.indexOf(b)).join('')
}

export function colorBucket(colorIdentity) {
  if (!colorIdentity || colorIdentity.length === 0) return 'C'
  if (colorIdentity.length === 1) return colorIdentity[0]
  return 'multi'
}

export function isCreature(typeLine) {
  return /\bCreature\b/.test(typeLine || '')
}

export function isLand(typeLine) {
  return /\bLand\b/.test(typeLine || '')
}

export function isArtifact(typeLine) {
  return /\bArtifact\b/.test(typeLine || '')
}

const RARITY_ORDER = ['common', 'uncommon', 'rare', 'mythic']
export function rarityRank(rarity) {
  return RARITY_ORDER.indexOf(rarity)
}

export function readSlug(setCode) {
  return setCode.toLowerCase()
}

/** True if every color in `colorIdentity` is a member of `colorSet` (colorless cards trivially qualify). */
export function isSubsetColorIdentity(colorIdentity, colorSet) {
  return colorIdentity.every(c => colorSet.has(c))
}

export function byRarityCount(cards) {
  return Object.fromEntries(RARITY_ORDER.map(r => [r, cards.filter(c => c.rarity === r).length]))
}

/** The 10 two-color pairs in canonical WUBRG order (matches colorKey's ordering). */
export const TWO_COLOR_PAIRS = ['WU', 'WB', 'WR', 'WG', 'UB', 'UR', 'UG', 'BR', 'BG', 'RG']
