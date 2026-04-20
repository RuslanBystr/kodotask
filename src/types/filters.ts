import { FilterItem } from '@/types/tables';

import { TSortingFields } from './sorting';

export enum FilterTypes {
  Text = 'text',
  Select = 'select',
  Date = 'date',
}

export type FiltersType = Array<null | FilterItem>;

export type FiltersChangeFunc = (key: string, value: string | number | Date) => void;

export type SortFilterChangeFunc = (cellName: TSortingFields) => void;
