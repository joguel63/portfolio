import { z } from 'zod';

import { localeStringSchema, sectionIdSchema } from './common';

const canonicalSectionIds = ['sobre-mi', 'stack', 'proyectos', 'contacto'] as const;

export const navigationSchema = z.object({
  sections: z.array(
    z.object({
      id: sectionIdSchema,
      labels: localeStringSchema,
    }).strict(),
  ).superRefine((sections, context) => {
    if (sections.length !== canonicalSectionIds.length) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expected the canonical section set',
      });
      return;
    }

    const ids = sections.map((section) => section.id);

    if (canonicalSectionIds.some((id, index) => ids[index] !== id)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sections must match the canonical ids in order',
      });
    }
  }),
  localeLabels: localeStringSchema,
}).strict();
