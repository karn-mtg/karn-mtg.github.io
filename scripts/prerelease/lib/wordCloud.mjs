import { colorBucket, stripReminderText } from './util.mjs'
import { STOPWORDS } from './stopwords.mjs'
import { pullChanceForRow } from './pullChance.mjs'

const COLOR_BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']
const RARITIES = ['common', 'uncommon', 'rare', 'mythic']

function tokenize(text) {
  return (text.toLowerCase().match(/[a-z']+/g) || []).filter(w => w.length > 2)
}

/**
 * Word frequency + word x color matrix over card oracle text, per
 * feature.md's "Interaction / Synergy" word cloud. Strips reminder text
 * and each card's own name so self-references and rules-text boilerplate
 * don't dominate the count.
 */
export function computeWordCloud(cards, byRarityTotals, sealedConfig, { cloudSize = 40, topSize = 10, matrixSize = 15 } = {}) {
  const frequency = new Map()
  const byColor = new Map()
  const byRarity = new Map()

  for (const card of cards) {
    const text = stripReminderText(card.oracle_text)
    if (!text) continue
    const nameWords = new Set(tokenize(card.name))
    const bucket = colorBucket(card.color_identity)
    const rarity = card.rarity
    const seenInCard = new Set()

    for (const word of tokenize(text)) {
      if (STOPWORDS.has(word) || nameWords.has(word)) continue
      seenInCard.add(word)
    }
    for (const word of seenInCard) {
      frequency.set(word, (frequency.get(word) || 0) + 1)
      if (!byColor.has(word)) byColor.set(word, Object.fromEntries(COLOR_BUCKETS.map(b => [b, 0])))
      byColor.get(word)[bucket]++
      if (!byRarity.has(word)) byRarity.set(word, Object.fromEntries(RARITIES.map(r => [r, 0])))
      if (RARITIES.includes(rarity)) byRarity.get(word)[rarity]++
    }
  }

  const ranked = [...frequency.entries()].sort((a, b) => b[1] - a[1])

  const withPullChance = word => ({
    byRarity: byRarity.get(word),
    byColor: byColor.get(word),
    pullChance: pullChanceForRow(byRarity.get(word), byRarityTotals, sealedConfig),
  })

  const wordCloud = ranked.slice(0, cloudSize).map(([word, count]) => ({ word, count, ...withPullChance(word) }))
  const topWords = ranked.slice(0, topSize).map(([word, count]) => ({ word, count, ...withPullChance(word) }))
  const wordColorMatrix = ranked.slice(0, matrixSize).map(([word]) => ({ word, byColor: byColor.get(word) }))

  return { wordCloud, topWords, wordColorMatrix }
}
