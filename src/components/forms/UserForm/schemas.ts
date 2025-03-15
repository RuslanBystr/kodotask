import { z } from 'zod';

import { editPassword, email, firstName, initialPassword, lastName, text } from '@/constants';

export const userCreateFormSchema = z
  .object({
    firstName,
    lastName,
    email,
    password: initialPassword,
    confirmPassword: initialPassword,
    avatar: text,
  })
  .required()
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const userEditFormSchema = z
  .object({
    firstName,
    lastName,
    email,
    password: editPassword,
    avatar: text,
  })
  .required();
