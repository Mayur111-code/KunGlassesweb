import { z } from 'zod';

const imageUrl = z.string().url().refine((value) => /^https?:\/\//i.test(value), 'Image URL must use http or https');

const specificationSchema = z.object({
  label: z.string().min(1, 'Specification label is required'),
  value: z.string().min(1, 'Specification value is required'),
});

export const createServiceSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z.string().optional(),
  shortDescription: z.string().min(1, 'Short description is required').max(500),
  description: z.string().min(1, 'Description is required'),
  featuredImage: imageUrl.optional(),
  gallery: z.array(imageUrl).optional(),
  features: z.array(z.string()).optional(),
  specifications: z.array(specificationSchema).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  displayOrder: z.number().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export const serviceSchema = createServiceSchema;

export const serviceSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});
