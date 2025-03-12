import { SortingOrderEnum } from '@/enums';

export interface IRequestParams {
  limit: number;
  page: number;
  sortBy?: string;
  order?: SortingOrderEnum;
}
