import { z } from 'zod';

import { text } from '@/constants';

export const projectCreateFormSchema = z.object({
  name: text,
  description: text,
});

export const projectEditFormSchema = z.object({
  name: text,
  description: text,
  image: text.optional(),
});
