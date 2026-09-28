import { z } from 'zod';
import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateUserSchema = createUserSchema.partial();

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const source = { ...req.params, ...req.body };
    const result = schema.safeParse(source);
    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(message, 400));
    }
    req.body = result.data;
    next();
  };
};
