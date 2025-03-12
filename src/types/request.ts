import { SortingOrderEnum } from '@/enums/sorting/sortingOrder';

export interface IRequestParams {
  limit: number;
  page: number;
  sortBy?: string;
  order?: SortingOrderEnum;
}

export interface IChatRequestParams extends IRequestParams {
  chatId: string;
}
export interface IMetadataRequestParams extends IRequestParams {
  url?: string;
  title?: string;
  h1?: string;
  description?: string;
  keywords?: string;
  subtitle?: string;
}

export interface IStaticPagesRequestParams extends IRequestParams {
  content?: string;
  createdAt?: string;
  id?: number;
  noIndex?: boolean;
  slug?: string;
  title?: string;
  updatedAt?: string;
}
