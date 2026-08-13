// One-off: derive public/pool-data/HOB.json from the existing Pre-Release
// article data (src/content/prerelease-data/hob.json), since HOB has no
// power_score dataset from Karn's own v1-heuristic pipeline yet.
//
// power_score here is a rescaled stand-in for the legacy BREAD "overall"
// score (factor 0.6, capped at 5) so it sits in roughly the same range as
// FIN/BLB/EOE's real power_score — it is NOT computed by the same pipeline,
// just calibrated to look comparable in the UI.
import { readFileSync, writeFileSync } from 'node:fs'

const hob = JSON.parse(readFileSync(new URL('../src/content/prerelease-data/hob.json', import.meta.url)))

function scryfallIdFromImage(url) {
  const m = url.match(/front\/\w\/\w\/([0-9a-f-]{36})\./)
  return m ? m[1] : null
}

function breadLetter(bread) {
  const cats = { B: bread.bomb, R: bread.removal, E: bread.evasion, A: bread.aggro, D: bread.diversity }
  let best = 'F'
  let bestVal = 0
  for (const [letter, val] of Object.entries(cats)) {
    if (val > bestVal) { best = letter; bestVal = val }
  }
  return best
}

const rarities = { common: [], uncommon: [], rare: [], mythic: [] }

for (const card of hob.cards) {
  const bucket = rarities[card.rarity]
  if (!bucket) continue
  bucket.push({
    oracleId: card.oracleId,
    scryfallId: scryfallIdFromImage(card.image),
    name: card.name,
    typeLine: card.typeLine,
    manaCost: card.manaCost,
    cmc: card.cmc,
    colors: card.colors,
    rarity: card.rarity,
    imageUrl: card.image,
    foilEligible: true,
    power_score: Math.min(5, +(card.bread.overall * 0.6).toFixed(2)),
    bread: breadLetter(card.bread),
    narrow_synergy: false,
  })
}

const out = {
  set_code: 'hob',
  set_name: 'The Hobbit',
  score_version: 'legacy-bread-derived-v1',
  generated_at: new Date().toISOString(),
  card_count: hob.cards.length,
  rarities,
}

writeFileSync(new URL('../public/pool-data/HOB.json', import.meta.url), JSON.stringify(out, null, 2))
console.log(`Wrote HOB.json: ${hob.cards.length} cards (${Object.entries(rarities).map(([r, c]) => `${r}:${c.length}`).join(', ')})`)
