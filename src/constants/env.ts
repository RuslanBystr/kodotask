import zod from 'zod';

import { TEnv } from '@/types';

export const envValidationSchema = zod.object({
  PUBLIC_API_URL: zod.string().url(),
});

export const validatedEnv: TEnv = envValidationSchema.parse(import.meta.env);

export const MockUsers = {
  items: [
    {
      id: 1,
      userName: 'SuperAdmin',
      firstName: 'SuperAdmin',
      lastName: 'SuperAdmin',
      email: 'superemail@gmail.com',
      status: 'active',
      role: 'superAdmin',
      createdAt: '2024-04-12T13:33:09.099Z',
      updatedAt: '2024-04-12T13:33:09.099Z',
    },
    {
      id: 1,
      userName: 'SuperAdmin',
      firstName: 'SuperAdmin',
      lastName: 'SuperAdmin',
      email: 'superemail@gmail.com',
      status: 'active',
      role: 'superAdmin',
      createdAt: '2024-04-12T13:33:09.099Z',
      updatedAt: '2024-04-12T13:33:09.099Z',
    },
    {
      id: 1,
      userName: 'SuperAdmin',
      firstName: 'SuperAdmin',
      lastName: 'SuperAdmin',
      email: 'superemail@gmail.com',
      status: 'active',
      role: 'superAdmin',
      createdAt: '2024-04-12T13:33:09.099Z',
      updatedAt: '2024-04-12T13:33:09.099Z',
    },
  ],
  meta: {
    totalItems: 3,
    itemCount: 1,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1,
  },
};
