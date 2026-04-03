import { z } from 'zod';

import { absoluteUrlSchema, assetPathSchema, contentIdSchema, nonEmptyStringSchema } from './common';

export const projectLinkSchema = z.object({
  url: absoluteUrlSchema,
  label: nonEmptyStringSchema.optional(),
}).strict();

export const projectLinksSchema = z.object({
  demo: projectLinkSchema.optional(),
  repo: projectLinkSchema.optional(),
  caseStudy: projectLinkSchema.optional(),
}).strict().refine(
  (links) => Boolean(links.demo || links.repo || links.caseStudy),
  'At least one project link must be provided',
);

export const projectsSchema = z.array(
  z.object({
    id: contentIdSchema,
    title: nonEmptyStringSchema,
    summary: nonEmptyStringSchema,
    year: nonEmptyStringSchema,
    role: nonEmptyStringSchema,
    stack: z.array(nonEmptyStringSchema).min(1),
    featured: z.boolean(),
    image: assetPathSchema.optional(),
    imageAlt: nonEmptyStringSchema.optional(),
    links: projectLinksSchema,
  }).strict(),
).min(1);
