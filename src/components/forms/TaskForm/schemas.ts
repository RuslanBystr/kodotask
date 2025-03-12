import { z } from 'zod';

import { text } from '@/constants';

export const taskCreateFormSchema = z
  .object({
    title: text,
    description: text,
    assignedUserId: text,
    projectId: text,
    priority: text,
  })
  .required();

export const taskEditFormSchema = z
  .object({
    title: text,
    description: text,
    assignedUserId: text,
    projectId: text,
    priority: text,
  })
  .required();
