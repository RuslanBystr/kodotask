import { IMetaResponse } from '@/types';

export interface IResponse<T> {
  meta: IMetaResponse;
  items: T[];
}
