import React, { useMemo } from 'react';

export default function useTableFilters(columnFilters: React.ComponentState[]) {
  const filters = useMemo(() => {
    const filterObj: Record<string, string> = {};
    columnFilters.forEach((filter) => {
      filterObj[filter.id] = filter.value;
    });
    return filterObj;
  }, [columnFilters]);

  return [filters];
}
