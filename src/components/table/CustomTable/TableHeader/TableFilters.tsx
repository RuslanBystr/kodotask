import { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type SortDirection = 'asc' | 'desc';

export const SortingButton = <T,>({ column, title }: { column: Column<T>; title?: string }) => {
  const getSortIcon = (sortState: boolean | SortDirection) => {
    if (sortState === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (sortState === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown />;
  };

  return (
    <Button variant="ghost" className="flex justify-start" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      {getSortIcon(column.getIsSorted())}
    </Button>
  );
};

export const FilterInput = <T,>({ column, placeholder }: { column: Column<T>; placeholder?: string }) => (
  <Input
    placeholder={placeholder}
    value={(column.getFilterValue() as string) ?? ''}
    onChange={(event) => column.setFilterValue(event.target.value)}
    className="max-w-sm my-1 focus-visible:border-b-2 focus-visible:border-b-gray-400"
  />
);
