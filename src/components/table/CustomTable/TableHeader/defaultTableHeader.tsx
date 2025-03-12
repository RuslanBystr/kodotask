import { HeaderContext } from '@tanstack/react-table';

import { FilterInput, SortingButton } from '@/components/table/CustomTable/TableHeader/TableFilters';

export const getDefaultColumnHeader =
  <T, TT>({ name, sort = true, search = true }: { name?: string; sort?: boolean; search?: boolean }) =>
  ({ column }: HeaderContext<T, TT>) => (
    <div className="flex flex-col">
      {sort ? <SortingButton title={name} column={column} /> : <div>{name}</div>}
      {search ? <FilterInput column={column} placeholder={`Search by ${name}`} /> : <div className="h-[44px]" />}
    </div>
  );
