import { z } from 'zod';
const imageUrl = z.string().url().refine((value) => /^https?:\/\//i.test(value), 'Image URL must use http or https');

export const createProjectSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  slug: z.string().optional(),
  client: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  serviceName: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  images: z.array(imageUrl).optional(),
  completionYear: z.number().optional(),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectSchema = createProjectSchema;

export const projectSlugSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});
