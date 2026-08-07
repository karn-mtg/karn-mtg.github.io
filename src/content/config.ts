import { defineCollection, z } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
})

const authors = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    bioPtBr: z.string().optional(),
    bioDe: z.string().optional(),
    bioEs: z.string().optional(),
    role: z.string(),
    rolePtBr: z.string().optional(),
    roleDe: z.string().optional(),
    roleEs: z.string().optional(),
    avatar: z.string().optional(),
  }),
})

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    lang: z.enum(['en', 'pt-br', 'de', 'es']).default('en'),
  }),
})

const prerelease = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    setCode: z.string(),
    setName: z.string(),
    author: z.string().optional(),
    image: z.string().optional(),
    lang: z.enum(['en', 'pt-br', 'de', 'es']).default('en'),
    generalInfoIntro: z.string(),
    manaCurveIntro: z.string().optional(),
    synergyIntro: z.string().optional(),
    breadIntro: z.string(),
    analysisIntro: z.string().optional(),
    introText: z.string().optional(),
    wordCloudIntro: z.string().optional(),
    kindredIntro: z.string().optional(),
    blockAloneConclusion: z.string().optional(),
    mechanicsIntro: z.string().optional(),
    breadByColorIntro: z.string().optional(),
    conclusionText: z.string().optional(),
  }),
})

const breadScoreSchema = z.object({
  bomb: z.number(),
  removal: z.number(),
  evasion: z.number(),
  aggro: z.number(),
  diversity: z.number(),
  overall: z.number(),
  tags: z.array(z.string()),
})

const byRaritySchema = z.record(z.string(), z.number())

const colorStatsSchema = z.object({
  cardCount: z.number(),
  byColor: z.record(z.string(), z.object({
    total: z.number(),
    creature: z.number(),
    nonCreature: z.number(),
  })),
  byRarity: byRaritySchema,
})

const manaCombosSchema = z.array(z.object({
  colors: z.string(),
  cardCount: z.number(),
  avgBomb: z.number(),
  avgOverall: z.number(),
  topCards: z.array(z.string()),
  byRarity: byRaritySchema,
  pullChance: z.number(),
  expectedQualityScore: z.number(),
  rawScorePercent: z.number(),
  curveFitPercent: z.number(),
  deckPullChancePercent: z.number(),
  synergyPercent: z.number(),
  synergyThemes: z.array(z.string()),
  deckFeasible: z.boolean(),
  finalScore: z.number(),
}))

const wordEntrySchema = z.object({
  word: z.string(),
  count: z.number(),
  byRarity: byRaritySchema,
  byColor: z.record(z.string(), z.number()),
  pullChance: z.number(),
})

const mechanicEntrySchema = z.object({
  mechanic: z.string(),
  count: z.number(),
  synergyCount: z.number(),
  byRarity: byRaritySchema,
  pullChance: z.number(),
  description: z.string().optional(),
})

const synergyCombinationsSchema = z.array(z.object({
  mechanics: z.array(z.string()),
  count: z.number(),
  examples: z.array(z.string()),
  verdict: z.enum(['confirmed', 'coincidental', 'unclear']),
  mechanism: z.string().optional(),
}))

const crossCardSynergiesSchema = z.object({
  synergies: z.array(z.object({
    name: z.string(),
    description: z.string(),
    payoffCardCount: z.number(),
    enablerCardCount: z.number(),
    payoffByRarity: byRaritySchema,
    enablerByRarity: byRaritySchema,
    probabilityPayoff: z.number(),
    probabilityEnablers: z.number(),
    comboScore: z.number(),
    avgQuality: z.number(),
    topPayoffCards: z.array(z.object({ name: z.string(), colorIdentity: z.array(z.string()) })),
    topEnablerCards: z.array(z.object({ name: z.string(), colorIdentity: z.array(z.string()) })),
  })),
  multiRoleCards: z.array(z.object({
    name: z.string(),
    colorIdentity: z.array(z.string()),
    themeCount: z.number(),
    themes: z.array(z.string()),
  })),
})

const archetypeAnalysisSchema = z.array(z.object({
  colors: z.string(),
  name: z.string(),
  mechanic: z.string(),
  description: z.string(),
  deckFeasible: z.boolean(),
  expectedCreatures: z.number(),
  expectedSpells: z.number(),
  creatureFeasibility: z.number(),
  spellFeasibility: z.number(),
  deckCreatureTarget: z.number(),
  deckSpellTarget: z.number(),
  supportCardCount: z.number(),
  byRarity: byRaritySchema,
  expectedCount: z.number(),
  probabilityAtLeastOne: z.number(),
  probabilityPlayable: z.number(),
  avgQuality: z.number(),
  setWideAvgQuality: z.number(),
  rankAmongPairs: z.number().nullable(),
  totalPairs: z.number(),
  signalCards: z.array(z.string()),
  verdict: z.enum(['wellSupported', 'plentifulButWeak', 'rareButStrong', 'dataDisagrees', 'themeThin', 'insufficient']),
  alternativeSignal: z.object({
    mechanic: z.string(),
    cardCount: z.number(),
    avgOverall: z.number(),
  }).nullable(),
}))

const creatureTypesSchema = z.object({
  subtypes: z.array(z.object({
    subtype: z.string(),
    count: z.number(),
    byColor: z.record(z.string(), z.number()),
    byRarity: byRaritySchema,
    pullChance: z.number(),
  })),
  kindredSignals: z.array(z.object({
    color: z.string(),
    subtype: z.string(),
    count: z.number(),
    concentration: z.number(),
  })),
  kindredSignalsByPair: z.array(z.object({
    colors: z.string(),
    subtype: z.string(),
    count: z.number(),
    concentration: z.number(),
  })),
  subtypeColorAffinity: z.array(z.object({
    subtype: z.string(),
    count: z.number(),
    W: z.number(),
    U: z.number(),
    B: z.number(),
    R: z.number(),
    G: z.number(),
  })),
})

const breadByColorSchema = z.array(z.object({
  color: z.string(),
  cardCount: z.number(),
  bomb: z.number(),
  removal: z.number(),
  evasion: z.number(),
  aggro: z.number(),
  diversity: z.number(),
  overall: z.number(),
}))

const manaCurveByColorSchema = z.array(z.object({
  color: z.string(),
  counts: z.record(z.string(), z.number()),
  total: z.number(),
}))

const curveFitByPairSchema = z.array(z.object({
  colors: z.string(),
  expected: z.record(z.string(), z.number()),
  curveFitPercent: z.number(),
}))

const boosterOddsSchema = z.record(z.string(), z.object({
  uniqueCount: z.number(),
  slotsOpened: z.number(),
  duplicateChance: z.number(),
}))

const fixerSummarySchema = z.object({
  cardCount: z.number(),
  byRarity: byRaritySchema,
  pullChance: z.number(),
  topCards: z.array(z.string()),
})

const manaFixingSchema = z.object({
  colorlessFixers: fixerSummarySchema,
  dualFixersByPair: z.array(z.object({ colors: z.string() }).extend(fixerSummarySchema.shape)),
  fixersByColor: z.array(z.object({ color: z.string() }).extend(fixerSummarySchema.shape)),
  splashSuggestions: z.array(z.object({
    colors: z.string(),
    candidates: z.array(z.object({
      color: z.string(),
      dualFixerCount: z.number(),
      expectedCount: z.number(),
      pullChance: z.number(),
    })),
    bestSplash: z.string().nullable(),
  })),
  topSplashCombos: z.array(z.object({
    baseColors: z.string(),
    splashColor: z.string(),
    baseStrengthPercent: z.number(),
    splashQualityPercent: z.number(),
    fixingPercent: z.number(),
    combinedScore: z.number(),
    splashRemoval: z.number(),
    topCards: z.array(z.string()),
  })),
})

/** Wraps a per-pool schema in the {all, commonsOnly} shape every rarity-sensitive field carries — see the "Remove Rares/Mythics" toggle in analyze.mjs's computeForPool. */
const dual = (schema) => z.object({ all: schema, commonsOnly: schema })

const prereleaseData = defineCollection({
  type: 'data',
  schema: z.object({
    setCode: z.string(),
    generatedAt: z.string(),
    cardCount: z.number(),
    colorStats: dual(colorStatsSchema),
    cards: z.array(z.object({
      name: z.string(),
      oracleId: z.string(),
      manaCost: z.string(),
      cmc: z.number(),
      typeLine: z.string(),
      colors: z.array(z.string()),
      colorIdentity: z.array(z.string()),
      rarity: z.string(),
      image: z.string().optional(),
      bread: breadScoreSchema,
    })),
    bestCards: dual(z.array(z.string())),
    manaCombos: dual(manaCombosSchema),
    wordCloud: dual(z.array(wordEntrySchema)),
    topWords: dual(z.array(wordEntrySchema)),
    wordColorMatrix: dual(z.array(z.object({
      word: z.string(),
      byColor: z.record(z.string(), z.number()),
    }))),
    mechanics: dual(z.array(mechanicEntrySchema)),
    mechanicColorMatrix: dual(z.array(z.object({
      mechanic: z.string(),
      byColor: z.record(z.string(), z.number()),
    }))),
    mechanicsBySynergy: dual(z.array(mechanicEntrySchema)),
    synergyCombinations: dual(synergyCombinationsSchema),
    crossCardSynergies: dual(crossCardSynergiesSchema),
    archetypeAnalysis: dual(archetypeAnalysisSchema),
    creatureTypes: dual(creatureTypesSchema),
    breadByColor: dual(breadByColorSchema),
    boosterOdds: dual(boosterOddsSchema),
    manaCurveByColor: dual(manaCurveByColorSchema),
    curveFitByPair: dual(curveFitByPairSchema),
    manaFixing: dual(manaFixingSchema),
  }),
})

export const collections = { docs, blog, authors, prerelease, 'prerelease-data': prereleaseData }
