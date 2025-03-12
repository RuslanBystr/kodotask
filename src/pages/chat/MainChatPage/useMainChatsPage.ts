import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import * as React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { SortingOrderEnum } from '@/enums';
import { usePagination, useTableFilters } from '@/hooks';
import useTableSorting from '@/hooks/useTableSorting';
import { useGetUserChatsQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';

export const useMainChatsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [filters] = useTableFilters(columnFilters);
  const [sortBy, isOrderByAsc] = useTableSorting(sorting);
  const paginateParams = usePagination(filters);

  const { page, rowsPerPage: limit } = paginateParams;
  const userData = useSelector(selectAuthenticatedUserSelector);
  const { data: chats, isLoading } = useGetUserChatsQuery({
    limit,
    page: page + 1,
    userId: userData?.id,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    ...filters,
  });

  const meta = chats?.meta;

  const noData = !chats?.items.length;

  return {
    chats,
    meta,
    noData,
    isLoading,
    columnFilters,
    paginateParams,
    sorting,
    setSorting,
    setColumnFilters,
  };
};
