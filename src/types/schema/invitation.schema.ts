import { z } from 'zod';
import { Role } from '@/types/enum';

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  role: z.nativeEnum(Role).optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional(),
});

export const acceptInvitationSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters.'),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value?.length ? value : undefined)),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type AcceptInvitationInput = z.infer<typeof acceptInvitationSchema>;
