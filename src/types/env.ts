import zod from 'zod';

import { envValidationSchema } from '@/constants';

export type TEnv = zod.infer<typeof envValidationSchema>;

export type TParsedEnv = {
  api: string;
};
