import { z } from 'zod';
const imageUrl = z.string().url().refine((value) => /^https?:\/\//i.test(value), 'Image URL must use http or https');

export const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(200),
  logo: imageUrl.optional(),
  description: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  category: z.string().optional(),
  location: z.string().optional(),
  projectDescription: z.string().optional(),
  displayOrder: z.number().optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const clientSchema = createClientSchema;
