import { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { SortingOrderEnum } from '@/enums';
import { ChatTypeEnum } from '@/enums/chat-type.enum';
import { usePagination, useTableFilters, useTableSorting } from '@/hooks';
import { useGetUserChatsQuery, useGetUserGroupChatsQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IChatRequestParams } from '@/types';

export const useMainChatsPage = ({ chatTypeQuery }: { chatTypeQuery: ChatTypeEnum }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const [filters] = useTableFilters(columnFilters);
  const [sortBy, isOrderByAsc] = useTableSorting(sorting);
  const paginateParams = usePagination(filters);

  const { page } = paginateParams;
  const userData = useSelector(selectAuthenticatedUserSelector);
  const userId = userData?.id.toString() ?? '';

  const queryParams: IChatRequestParams = {
    limit: 100,
    userId,
    page: page + 1,
    sortBy,
    order: isOrderByAsc ? SortingOrderEnum.ASC : SortingOrderEnum.DESC,
    ...filters,
  };

  let queryResult: ReturnType<typeof useGetUserChatsQuery>;

  switch (chatTypeQuery) {
    case ChatTypeEnum.PRIVATE:
      // eslint-disable-next-line react-hooks/rules-of-hooks
      queryResult = useGetUserChatsQuery(queryParams, { skip: !userData?.id });
      break;
    case ChatTypeEnum.GROUP:
      // eslint-disable-next-line react-hooks/rules-of-hooks
      queryResult = useGetUserGroupChatsQuery(queryParams, { skip: !userData?.id });
      break;
    default:
      throw new Error('Invalid chat type');
  }

  const { data: chats, isLoading, refetch } = queryResult;
  const meta = chats?.meta;
  const noData = !chats?.items?.length;

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
