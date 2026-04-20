import { z } from 'zod';

import { passwordRegexp } from './regexp';

export const email = z.string().email().trim().min(1, 'Email is a required');

export const firstName = z
  .string()
  .trim()
  .min(1, 'First name is a required')
  .regex(/^[a-zA-Z0-9]+$/, { message: 'Only letters and numbers allowed' });

export const lastName = z
  .string()
  .trim()
  .min(1, 'Last name is a required')
  .regex(/^[a-zA-Z0-9]+$/, { message: 'Only letters and numbers allowed' });

export const text = z.string().trim().min(1);

const selectCreatableOption = z.object({
  label: z.string(),
  value: z.string(),
  __isNew__: z.boolean(),
});

export const tags = z.array(selectCreatableOption).min(1, 'At least one tag is required');

export const nickname = z
  .string()
  .trim()
  .min(1, 'Nickname is a required')
  .regex(/^[a-zA-Z0-9_]+$/, { message: 'Only letters, numbers, and underscores allowed' });

export const content = z.string().trim().min(1, 'Content is a required field');

export const title = z.string().trim().min(1, 'Title is a required field');

export const slug = z.string().trim().min(1, 'Slug is a required field');

export const number = z.number().min(1, 'Only numbers allowed');

export const initialPassword = z
  .string()
  .trim()
  .min(1, 'Password is a required')
  .regex(
    passwordRegexp,
    'Password must contain at least 8 characters, at least one number and both lower and uppercase letters',
  );

export const editPassword = z
  .string()
  .trim()
  .regex(
    passwordRegexp,
    'Password must contain at least 8 characters, at least one number and both lower and uppercase letters',
  );
