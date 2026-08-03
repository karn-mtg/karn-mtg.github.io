import { colorBucket, stripReminderText } from './util.mjs'

const COLOR_BUCKETS = ['W', 'U', 'B', 'R', 'G', 'multi', 'C']

/**
 * Mechanics = Scryfall-parsed keyword abilities (Flying, Ward, Channel, ...).
 * Per feature.md: a full mechanics list for the set, a mechanic x color
 * matrix, and a "synergy" ranking of which mechanics show up most often
 * alongside the set's top word-cloud words (i.e. which mechanics have the
 * most cards that also do something the word cloud flagged as a core
 * synergy action).
 */
export function computeMechanics(cards, topWords) {
  const frequency = new Map()
  const byColor = new Map()
  const synergyCount = new Map()

  const topWordSet = new Set(topWords.map(w => w.word))

  for (const card of cards) {
    const bucket = colorBucket(card.color_identity)
    const text = stripReminderText(card.oracle_text).toLowerCase()
    const cardWords = new Set(text.match(/[a-z']+/g) || [])
    const hasSynergyWord = [...topWordSet].some(w => cardWords.has(w))

    for (const kw of card.keywords || []) {
      frequency.set(kw, (frequency.get(kw) || 0) + 1)
      if (!byColor.has(kw)) byColor.set(kw, Object.fromEntries(COLOR_BUCKETS.map(b => [b, 0])))
      byColor.get(kw)[bucket]++
      if (hasSynergyWord) synergyCount.set(kw, (synergyCount.get(kw) || 0) + 1)
    }
  }

  const mechanics = [...frequency.entries()]
    .map(([mechanic, count]) => ({
      mechanic,
      count,
      synergyCount: synergyCount.get(mechanic) || 0,
    }))
    .sort((a, b) => b.count - a.count)

  const mechanicColorMatrix = mechanics.map(({ mechanic }) => ({ mechanic, byColor: byColor.get(mechanic) }))

  const bySynergy = [...mechanics].sort((a, b) => b.synergyCount - a.synergyCount)

  return { mechanics, mechanicColorMatrix, mechanicsBySynergy: bySynergy }
}
