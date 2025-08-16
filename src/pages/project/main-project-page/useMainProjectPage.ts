import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SortingOrderEnum } from '@/enums';
import { usePagination, useTableFilters } from '@/hooks';
import useTableSorting from '@/hooks/useTableSorting';
import { useGetProjectsQuery } from '@/services/project';

export const useMainProjectPage = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const [filters] = useTableFilters(columnFilters);
  const [sortBy, isOrderByAsc] = useTableSorting(sorting);
  const paginateParams = usePagination(filters);

  const { page, rowsPerPage: limit } = paginateParams;

  const { data: projects, isLoading } = useGetProjectsQuery({
    limit,
    page: page + 1,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    ...filters,
  });

  const meta = projects?.meta;

  const noData = !projects?.items.length;

  const goToCreateProjectPage = () => {
    navigate('create');
  };

  return {
    projects,
    meta,
    noData,
    isLoading,
    columnFilters,
    paginateParams,
    sorting,
    setSorting,
    setColumnFilters,
    goToCreateProjectPage,
  };
};
