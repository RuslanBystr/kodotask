import { validatedEnv } from '@/constants/env';
import { TParsedEnv } from '@/types';

const mapEnv = () => {
  const parsed: TParsedEnv = {
    api: validatedEnv.PUBLIC_API_URL,
  };
  return Object.freeze(parsed);
};

let env: TParsedEnv;

export const getEnv = (): TParsedEnv => {
  if (!env) {
    env = mapEnv();
  }
  return env;
};
