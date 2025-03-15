import { z } from 'zod';

import { number, text } from '@/constants';

export const taskCreateFormSchema = z
  .object({
    title: text,
    description: text,
    assignedUserId: text,
    projectId: text,
    priority: text,
    estimate: number,
  })
  .required();

export const taskEditFormSchema = z
  .object({
    title: text,
    description: text,
    assignedUserId: text,
    projectId: text,
    priority: text,
    estimate: number,
  })
  .required();
