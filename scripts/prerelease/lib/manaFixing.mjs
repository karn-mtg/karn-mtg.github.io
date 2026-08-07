import { stripReminderText, colorKey, isLand, isArtifact, TWO_COLOR_PAIRS } from './util.mjs'
import { expectedSealedCount } from './sealedProbability.mjs'
import { pullChanceForRow } from './pullChance.mjs'

const RARITIES = ['common', 'uncommon', 'rare', 'mythic']
const COLORS = ['W', 'U', 'B', 'R', 'G']

const ANY_COLOR_RE = /add (one|1) mana of any (one )?color/i
const TREASURE_RE = /creates? .{0,40}?treasure token/i
const CHOOSE_COLOR_LAND_RE = /choose a color.{0,60}?add (one )?mana of the chosen color/i
const FETCH_RE = /search your library for .{0,40}?\bland\b/i
const DUAL_RE = /add \{([wubrgc])\}\s*or\s*\{([wubrgc])\}/i

/**
 * Lands and artifacts are the permanent types that realistically get
 * printed with fixing abilities and are castable/usable regardless of a
 * deck's own colors. Deliberately *not* gated by color_identity: Scryfall's
 * color_identity includes colors referenced anywhere in a card's own text
 * (e.g. a dual land's colored sacrifice-ability cost), so a real GU dual
 * land can have color_identity=[G,U] even though its mana ability itself
 * is what matters here — filtering on that would wrongly exclude it.
 */
function isFixerCandidate(typeLine) {
  return isLand(typeLine) || isArtifact(typeLine)
}

function byRarityOf(cards) {
  return Object.fromEntries(RARITIES.map(r => [r, cards.filter(c => c.rarity === r).length]))
}

function summarize(cards, byRarityTotals, sealedConfig) {
  const byRarity = byRarityOf(cards)
  return {
    cardCount: cards.length,
    byRarity,
    pullChance: pullChanceForRow(byRarity, byRarityTotals, sealedConfig),
    topCards: cards.slice(0, 8).map(c => c.name),
  }
}

/**
 * Mana-fixing analysis: how easy is it to actually cast a splash in this
 * set, not just whether a gold card exists for a pair. Three source types:
 *
 *  - Flexible fixers: lands/artifacts that produce any color (mana rocks,
 *    "add one mana of any color" lands), plus Treasure makers (checked on
 *    *any* card regardless of its own color — the Treasure itself is
 *    colorless/any-color once made) and fetch lands (reuses the same
 *    pattern bread-rules.json's diversity category already uses).
 *  - Dual fixers: lands/artifacts whose text names two specific colors
 *    ("Add {X} or {Y}"), attributed to that exact pair.
 *  - Everything folds into fixersByColor (flexible fixers count toward
 *    every color; dual fixers count toward their two colors), which
 *    splashSuggestions then ranks per base pair to answer "which third
 *    color is easiest to splash from here."
 *
 * Known simplification: a mono/gold-colored creature or spell with its own
 * "any color" ability (e.g. a green creature that taps for any color) isn't
 * counted — only lands/artifacts and Treasure-makers are, since those are
 * usable regardless of what colors a deck is already in.
 */
export function computeManaFixing(raw, byRarityTotals, sealedConfig, breadByColor, pairStrengthByColors) {
  const flexibleCards = []
  const dualCardsByPair = new Map(TWO_COLOR_PAIRS.map(p => [p, []]))

  for (const card of raw) {
    const text = stripReminderText(card.oracle_text)

    if (TREASURE_RE.test(text)) {
      flexibleCards.push(card)
      continue
    }

    if (!isFixerCandidate(card.type_line)) continue

    const dualMatch = text.match(DUAL_RE)
    if (dualMatch) {
      const pair = colorKey([dualMatch[1].toUpperCase(), dualMatch[2].toUpperCase()])
      if (dualCardsByPair.has(pair)) dualCardsByPair.get(pair).push(card)
      continue
    }

    if (ANY_COLOR_RE.test(text) || CHOOSE_COLOR_LAND_RE.test(text) || FETCH_RE.test(text)) {
      flexibleCards.push(card)
    }
  }

  const colorlessFixers = summarize(flexibleCards, byRarityTotals, sealedConfig)

  const dualFixersByPair = TWO_COLOR_PAIRS.map(pair => ({
    colors: pair,
    ...summarize(dualCardsByPair.get(pair), byRarityTotals, sealedConfig),
  }))

  const dualOnlyByColor = COLORS.map(color => {
    const dualForColor = TWO_COLOR_PAIRS
      .filter(p => p.includes(color))
      .flatMap(p => dualCardsByPair.get(p))
    return { color, cards: dualForColor, ...summarize(dualForColor, byRarityTotals, sealedConfig) }
  })

  const fixersByColor = dualOnlyByColor.map(({ color, cards: dualForColor }) => {
    const combined = [...flexibleCards, ...dualForColor]
    return { color, ...summarize(combined, byRarityTotals, sealedConfig) }
  })

  // Splash suggestions rank by *dual-specific* expected count, not the
  // combined fixersByColor total — the shared flexible-fixer baseline is
  // identical for every color within a pair (it doesn't discriminate), and
  // it's usually so much larger than the dual-fixer signal that blending
  // them rounds the real differentiator away. Ranking on the dual-only pool
  // keeps the "which color specifically has more dedicated fixing" signal
  // visible; combined expectedCount/pullChance stay attached per candidate
  // as the "how much fixing is available overall" reference stat.
  const dualExpectedByColor = Object.fromEntries(
    dualOnlyByColor.map(d => [d.color, expectedSealedCount(d.byRarity, byRarityTotals, sealedConfig)])
  )

  const splashSuggestions = TWO_COLOR_PAIRS.map(pair => {
    const baseColors = pair.split('')
    const candidates = COLORS
      .filter(c => !baseColors.includes(c))
      .map(color => {
        const overall = fixersByColor.find(f => f.color === color)
        return {
          color,
          dualFixerCount: dualOnlyByColor.find(d => d.color === color).cardCount,
          expectedCount: round(expectedSealedCount(overall.byRarity, byRarityTotals, sealedConfig)),
          pullChance: overall.pullChance,
        }
      })
      .sort((a, b) => dualExpectedByColor[b.color] - dualExpectedByColor[a.color])

    const [best, runnerUp] = candidates
    const tied = runnerUp && dualExpectedByColor[best.color] === dualExpectedByColor[runnerUp.color]

    return { colors: pair, candidates, bestSplash: tied ? null : (best?.color ?? null) }
  })

  const topSplashCombos = computeTopSplashCombos(dualOnlyByColor, dualExpectedByColor, breadByColor, pairStrengthByColors)

  return {
    colorlessFixers,
    dualFixersByPair,
    fixersByColor,
    splashSuggestions,
    topSplashCombos,
  }
}

/**
 * "Easiest third color to splash" ranked by dual-fixer count alone answers
 * the wrong question: it says how *easy* a splash is, not whether it's
 * *worth* doing. A GU base splashing B can be the right call over a BG base
 * splashing U even when BG has marginally more dual lands for U, because GU
 * is the stronger base pair (comboComposite's finalScore) and black brings
 * the best removal (breadByColor's removal/overall averages) — ease alone
 * would miss both signals. Blends three normalized (0-100) percentages:
 * base-pair strength (40%, the deck engine), splash-color quality (35%, why
 * this color specifically), and fixing ease (25%, a gate, not the point).
 * Returns the global top 3 base-pair + splash-color combos, not per-pair —
 * the earlier per-pair table forced a splash color onto every pair even when
 * that pair+color combo wasn't worth recommending at all.
 */
function computeTopSplashCombos(dualOnlyByColor, dualExpectedByColor, breadByColor, pairStrengthByColors) {
  if (!breadByColor || !pairStrengthByColors) return []

  const qualityByColor = Object.fromEntries(breadByColor.map(b => [b.color, b]))
  const dualTopCardsByColor = Object.fromEntries(dualOnlyByColor.map(d => [d.color, d.topCards]))
  const maxFixingExpected = Math.max(...Object.values(dualExpectedByColor), 1)
  const maxSplashQuality = Math.max(...COLORS.map(c => qualityByColor[c]?.overall ?? 0), 1)
  const maxBaseStrength = Math.max(...Object.values(pairStrengthByColors), 1)

  const combos = TWO_COLOR_PAIRS.flatMap(pair => {
    const baseColors = pair.split('')
    const baseStrengthPercent = round(((pairStrengthByColors[pair] ?? 0) / maxBaseStrength) * 100)

    return COLORS.filter(c => !baseColors.includes(c)).map(color => {
      const fixingPercent = round((dualExpectedByColor[color] / maxFixingExpected) * 100)
      const splashQualityPercent = round(((qualityByColor[color]?.overall ?? 0) / maxSplashQuality) * 100)
      const combinedScore = round(
        baseStrengthPercent * 0.4 + splashQualityPercent * 0.35 + fixingPercent * 0.25
      )

      return {
        baseColors: pair,
        splashColor: color,
        baseStrengthPercent,
        splashQualityPercent,
        fixingPercent,
        combinedScore,
        splashRemoval: qualityByColor[color]?.removal ?? 0,
        topCards: dualTopCardsByColor[color] ?? [],
      }
    })
  })

  return combos.sort((a, b) => b.combinedScore - a.combinedScore).slice(0, 3)
}

function round(n) {
  return Math.round(n * 10) / 10
}
