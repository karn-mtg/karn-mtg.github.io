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

export const collections = { docs, blog, authors }
