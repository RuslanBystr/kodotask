import { z, ZodType } from 'zod';

import { TSignInFormData } from '@/types';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

export const signInSchema: ZodType<TSignInFormData> = z.object({
  email: z.string().min(1, 'Email is required').email('Email is incorrect'),
  password: z
    .string()
    .min(1, 'Password is required')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least 8 characters, at least one number and both lower and uppercase letters',
    )
    .min(1, 'Password is required'),
});
