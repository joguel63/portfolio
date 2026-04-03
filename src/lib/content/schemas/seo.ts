import { z } from 'zod';

import { assetPathSchema, nonEmptyStringSchema } from './common';

export const seoSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  ogImage: assetPathSchema,
}).strict();
