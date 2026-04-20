import type { ChangeEvent, MouseEvent } from 'react';

import { FilterTypes } from '@/types/index';

export interface FilterValues {
  label: string;
  value: number | string | boolean;
}

export interface FilterItem {
  name: string;
  type: FilterTypes;
  defaultValue?: string;
  values?: FilterValues[];
}

export interface IPaginationParams {
  page: number;
  count: number;
  rowsPerPage: number;
  onPageChange: (event: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}
