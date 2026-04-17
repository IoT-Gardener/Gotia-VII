import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const missions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/missions' }),
  schema: z.object({
    title: z.string(),
    status: z.enum(['available', 'locked', 'complete', 'failed', 'redacted']),
    reward: z.string().optional(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const dossier = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/dossier' }),
  schema: z.object({
    name: z.string(),
    affiliation: z.string(),
    priority: z.enum(['one', 'two', 'asset', 'archived']),
    summary: z.string(),
  }),
});

const regions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/regions' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const cities = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cities' }),
  schema: z.object({
    name: z.string(),
    region: z.string(),
    summary: z.string(),
  }),
});

const factions = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/factions' }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    order: z.number().default(0),
  }),
});

const history = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/history' }),
  schema: z.object({
    title: z.string(),
    era: z.string(),
    dateLabel: z.string(),
    order: z.number(),
    summary: z.string(),
  }),
});

const lancers = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/lancers' }),
  schema: z.object({
    callsign: z.string(),
    name: z.string(),
    mech: z.string().optional(),
    affiliation: z.string().optional(),
    ref: z.string().optional(),
    status: z.enum(['active', 'mia', 'kia', 'unknown']).default('active'),
    summary: z.string(),
    clearance: z.array(z.string()).optional(),
  }),
});

export const collections = { missions, dossier, regions, cities, factions, history, lancers };
