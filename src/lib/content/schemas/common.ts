import { z } from 'zod';

export const nonEmptyStringSchema = z.string().trim().min(1);

export const emailSchema = nonEmptyStringSchema.email();

export const absoluteUrlSchema = nonEmptyStringSchema.url().refine(
  (value) => value.startsWith('http://') || value.startsWith('https://'),
  'Expected an absolute URL',
);

export const assetPathSchema = nonEmptyStringSchema.regex(/^\/[A-Za-z0-9/_\-.]+$/, 'Expected a root-relative path');

export const localeStringSchema = z.object({
  es: nonEmptyStringSchema,
  en: nonEmptyStringSchema,
}).strict();

export const sectionIdSchema = z.enum(['hero', 'sobre-mi', 'stack', 'proyectos', 'contacto']);

export const actionSchema = z.object({
  label: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
}).strict();

export const contentIdSchema = nonEmptyStringSchema.regex(/^[a-z0-9-]+$/, 'Expected a kebab-case id');
