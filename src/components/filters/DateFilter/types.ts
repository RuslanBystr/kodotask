import { FiltersChangeFunc } from '@/types';
import { FilterItem } from '@/types/tables';

export interface IDateFilterProps {
  filter: FilterItem;
  onChange: FiltersChangeFunc;
}
