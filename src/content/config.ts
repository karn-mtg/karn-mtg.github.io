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
    synergyIntro: z.string().optional(),
    breadIntro: z.string(),
    analysisIntro: z.string().optional(),
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

const prereleaseData = defineCollection({
  type: 'data',
  schema: z.object({
    setCode: z.string(),
    generatedAt: z.string(),
    cardCount: z.number(),
    colorStats: z.object({
      cardCount: z.number(),
      byColor: z.record(z.string(), z.object({
        total: z.number(),
        creature: z.number(),
        nonCreature: z.number(),
      })),
      byRarity: z.record(z.string(), z.number()),
    }),
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
    bestCards: z.array(z.string()),
    manaCombos: z.array(z.object({
      colors: z.string(),
      cardCount: z.number(),
      avgBomb: z.number(),
      avgOverall: z.number(),
      topCards: z.array(z.string()),
    })),
    wordCloud: z.array(z.object({ word: z.string(), count: z.number() })),
    topWords: z.array(z.object({ word: z.string(), count: z.number() })),
    wordColorMatrix: z.array(z.object({
      word: z.string(),
      byColor: z.record(z.string(), z.number()),
    })),
    mechanics: z.array(z.object({
      mechanic: z.string(),
      count: z.number(),
      synergyCount: z.number(),
      description: z.string().optional(),
    })),
    mechanicColorMatrix: z.array(z.object({
      mechanic: z.string(),
      byColor: z.record(z.string(), z.number()),
    })),
    mechanicsBySynergy: z.array(z.object({
      mechanic: z.string(),
      count: z.number(),
      synergyCount: z.number(),
      description: z.string().optional(),
    })),
    synergyCombinations: z.array(z.object({
      mechanics: z.array(z.string()),
      count: z.number(),
      examples: z.array(z.string()),
    })),
    archetypeAnalysis: z.array(z.object({
      colors: z.string(),
      name: z.string(),
      mechanic: z.string(),
      description: z.string(),
      supportCardCount: z.number(),
      byRarity: z.record(z.string(), z.number()),
      expectedCount: z.number(),
      probabilityAtLeastOne: z.number(),
      probabilityPlayable: z.number(),
      avgQuality: z.number(),
      setWideAvgQuality: z.number(),
      rankAmongPairs: z.number().nullable(),
      totalPairs: z.number(),
      signalCards: z.array(z.string()),
      verdict: z.enum(['wellSupported', 'plentifulButWeak', 'rareButStrong', 'dataDisagrees', 'insufficient']),
    })),
    creatureTypes: z.object({
      subtypes: z.array(z.object({
        subtype: z.string(),
        count: z.number(),
        byColor: z.record(z.string(), z.number()),
      })),
      kindredSignals: z.array(z.object({
        color: z.string(),
        subtype: z.string(),
        count: z.number(),
        concentration: z.number(),
      })),
    }),
  }),
})

export const collections = { docs, blog, authors, prerelease, 'prerelease-data': prereleaseData }
