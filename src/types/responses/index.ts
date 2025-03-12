export interface IMetaResponse {
  currentPage: number;
  itemCount: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface IResponse<T> {
  meta: IMetaResponse;
  items: T[];
}
