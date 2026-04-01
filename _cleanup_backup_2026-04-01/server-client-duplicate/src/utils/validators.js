import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    acceptTerms: z.boolean().refine((value) => value, 'You must accept terms'),
  })
  .refine((payload) => payload.password === payload.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
