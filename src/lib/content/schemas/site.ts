import { z } from 'zod';

import { absoluteUrlSchema, assetPathSchema, emailSchema, nonEmptyStringSchema } from './common';

export const siteSchema = z.object({
  siteUrl: absoluteUrlSchema,
  author: z.object({
    name: nonEmptyStringSchema,
    role: nonEmptyStringSchema,
    email: emailSchema,
  }).strict(),
  social: z.object({
    github: absoluteUrlSchema,
    linkedin: absoluteUrlSchema,
  }).strict(),
  assets: z
    .object({
      defaultOgImage: assetPathSchema.optional(),
      resume: assetPathSchema.optional(),
    })
    .strict(),
}).strict();
