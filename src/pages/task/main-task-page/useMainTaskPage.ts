import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SortingOrderEnum } from '@/enums';
import { usePagination, useTableFilters } from '@/hooks';
import useTableSorting from '@/hooks/useTableSorting';
import { useGetProjectsQuery } from '@/services/project';
import { useGetTasksQuery } from '@/services/task';

export const useMainTaskPage = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [selectProject, setSelectProject] = useState<number | undefined>(undefined);
  const [filters] = useTableFilters(columnFilters);
  const [sortBy, isOrderByAsc] = useTableSorting(sorting);
  const paginateParams = usePagination(filters, 50);

  const { page, rowsPerPage: limit } = paginateParams;

  const { data: projects } = useGetProjectsQuery({ limit: 50, page: 1 });

  const { data: tasks, isLoading } = useGetTasksQuery({
    limit,
    page: page + 1,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    projectId: selectProject,
    ...filters,
  });

  const meta = tasks?.meta;

  const noData = !tasks?.items.length;

  const goToCreateTaskPage = () => {
    navigate('create');
  };

  return {
    tasks,
    projects,
    meta,
    noData,
    isLoading,
    columnFilters,
    paginateParams,
    sorting,
    setSorting,
    setColumnFilters,
    goToCreateTaskPage,
    selectProject,
    setSelectProject,
  };
};
