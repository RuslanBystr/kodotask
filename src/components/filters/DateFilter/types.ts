import { FiltersChangeFunc } from '@/types';
import { FilterItem } from '@/types/tebles';

export interface IDateFilterProps {
  filter: FilterItem;
  onChange: FiltersChangeFunc;
}
