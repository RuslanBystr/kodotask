import React from 'react';

export default function useTableSorting(columnSorting: React.ComponentState[]) {
  const sortBy = columnSorting[0];
  const isOrderByAsc = sortBy ? sortBy.desc === false : true;
  return [sortBy?.id, isOrderByAsc];
}
