import { z } from 'zod';

import { contentIdSchema, nonEmptyStringSchema } from './common';

export const stackSchema = z.array(
  z.object({
    id: contentIdSchema,
    label: nonEmptyStringSchema,
    category: nonEmptyStringSchema,
    order: z.number().int().positive(),
    icon: nonEmptyStringSchema.optional(),
    description: nonEmptyStringSchema.optional(),
    skills: z.array(nonEmptyStringSchema).min(1),
  }).strict(),
).min(1);
