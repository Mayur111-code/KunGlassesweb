import { z } from 'zod';

const heroImageUrl = z
  .string()
  .url('Hero image must be a valid URL')
  .refine((value) => /^https:\/\//i.test(value), 'Hero image URL must use HTTPS');

export const updateSettingsSchema = z.object({
  companyName: z.string().optional(),
  tagline: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  aboutShort: z.string().optional(),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
  seoKeywords: z.array(z.string()).optional(),
  ogImage: z.string().optional(),
  googleVerification: z.string().optional(),
  robotsContent: z.string().optional(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  youtubeUrl: z.string().optional(),
  whatsappEnabled: z.boolean().optional(),
  whatsappDefaultMessage: z.string().optional(),
  address: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  footerDescription: z.string().optional(),
  copyrightText: z.string().optional(),
  heroImages: z
    .object({
      home: heroImageUrl.optional().or(z.literal('')),
      about: heroImageUrl.optional().or(z.literal('')),
      services: heroImageUrl.optional().or(z.literal('')),
      projects: heroImageUrl.optional().or(z.literal('')),
      clients: heroImageUrl.optional().or(z.literal('')),
      contact: heroImageUrl.optional().or(z.literal('')),
    })
    .optional(),
}).passthrough();
