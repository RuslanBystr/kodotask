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

  const { page } = paginateParams;
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id.toString() ?? '';

  const {
    data: chats,
    isLoading,
    refetch,
  } = useGetUserChatsQuery({
    limit: 100,
    userId,
    page: page + 1,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    ...filters,
  });

  const meta = chats?.meta;

  const noData = !chats?.items.length;

  return {
    chats,
    refetch,
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
