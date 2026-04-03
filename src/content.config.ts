import { defineCollection, z } from 'astro:content';

import { navigationSchema } from './lib/content/schemas/navigation';
import { homeSchema } from './lib/content/schemas/home';
import { projectsSchema } from './lib/content/schemas/projects';
import { seoSchema } from './lib/content/schemas/seo';
import { siteSchema } from './lib/content/schemas/site';
import { stackSchema } from './lib/content/schemas/stack';

export const collections = {
  global: defineCollection({
    type: 'data',
    schema: z.union([siteSchema, navigationSchema]),
  }),
  pages: defineCollection({
    type: 'data',
    schema: homeSchema,
  }),
  projects: defineCollection({
    type: 'data',
    schema: projectsSchema,
  }),
  seo: defineCollection({
    type: 'data',
    schema: seoSchema,
  }),
  stack: defineCollection({
    type: 'data',
    schema: stackSchema,
  }),
};
