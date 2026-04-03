import { z } from 'zod';

import { actionSchema, assetPathSchema, nonEmptyStringSchema } from './common';

export const homeSchema = z.object({
  hero: z.object({
    eyebrow: nonEmptyStringSchema,
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    chips: z.array(nonEmptyStringSchema).min(2),
    primaryCta: actionSchema,
    secondaryCta: actionSchema,
  }).strict(),
  about: z.object({
    title: nonEmptyStringSchema,
    heading: nonEmptyStringSchema,
    body: z.array(nonEmptyStringSchema).min(1),
    stats: z.array(z.object({
      value: nonEmptyStringSchema,
      label: nonEmptyStringSchema,
    }).strict()).length(2),
    image: assetPathSchema.optional(),
    imageAlt: nonEmptyStringSchema,
  }).strict(),
  stack: z.object({
    title: nonEmptyStringSchema,
    intro: nonEmptyStringSchema,
  }).strict(),
  projects: z.object({
    title: nonEmptyStringSchema,
    intro: nonEmptyStringSchema,
    sublabel: nonEmptyStringSchema,
  }).strict(),
  contact: z.object({
    title: nonEmptyStringSchema,
    heading: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    primaryAction: actionSchema,
    secondaryAction: actionSchema.optional(),
  }).strict(),
}).strict();
