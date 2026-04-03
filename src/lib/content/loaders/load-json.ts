import type { ZodSchema } from 'zod';

export function loadJson<T>(schemaName: string, schema: ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (result.success) {
    return result.data;
  }

  const details = result.error.issues
    .map((issue) => `${issue.path.join('.') || '<root>'}: ${issue.message}`)
    .join('; ');

  throw new Error(`Invalid ${schemaName} content: ${details}`);
}
