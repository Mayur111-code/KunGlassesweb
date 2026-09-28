import { z } from 'zod';

export const updateMediaSchema = z.object({
  altText: z.string().optional(),
  folder: z.string().optional(),
});
