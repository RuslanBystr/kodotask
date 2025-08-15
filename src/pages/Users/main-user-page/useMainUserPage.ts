import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SortingOrderEnum } from '@/enums';
import { usePagination, useTableFilters } from '@/hooks';
import useTableSorting from '@/hooks/useTableSorting';
import { useGetUsersQuery } from '@/services/users';

export const useMainUserPage = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [filters] = useTableFilters(columnFilters);
  const [sortBy, isOrderByAsc] = useTableSorting(sorting);
  const paginateParams = usePagination(filters);

  const { page, rowsPerPage: limit } = paginateParams;

  const { data: users, isLoading } = useGetUsersQuery({
    limit,
    page: page + 1,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    ...filters,
  });

  const meta = users?.meta;

  const noData = !users?.items.length;

  const goToCreateUserPage = () => {
    navigate('create');
  };

  return {
    users,
    meta,
    noData,
    isLoading,
    columnFilters,
    paginateParams,
    sorting,
    setSorting,
    setColumnFilters,
    goToCreateUserPage,
  };
};
