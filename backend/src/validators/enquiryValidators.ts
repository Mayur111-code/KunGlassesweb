import { z } from 'zod';

export const submitEnquirySchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Please provide a valid email').optional().or(z.literal('')),
  company: z.string().optional(),
  serviceInterestedIn: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContactMethod: z.enum(['phone', 'email', 'whatsapp']).optional(),
  location: z.string().optional(),
  source: z.enum(['website', 'whatsapp', 'phone', 'email', 'referral', 'other']).optional(),
});

export const enquirySchema = submitEnquirySchema;

export const updateEnquirySchema = z.object({
  fullName: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  company: z.string().optional(),
  serviceInterestedIn: z.string().optional(),
  serviceInterestedInName: z.string().optional(),
  message: z.string().min(10).optional(),
  preferredContactMethod: z.enum(['phone', 'email', 'whatsapp']).optional(),
  location: z.string().optional(),
  source: z.enum(['website', 'whatsapp', 'phone', 'email', 'referral', 'other']).optional(),
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'CONVERTED', 'REJECTED', 'CLOSED']).optional(),
  assignedTo: z.string().optional(),
  followUpDate: z.string().optional(),
});

export const statusSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'QUOTED', 'CONVERTED', 'REJECTED', 'CLOSED']),
});

export const noteSchema = z.object({
  note: z.string().min(1, 'Note is required'),
});
