import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnv, setAccessTokenToHeaders } from '@/utils';

const { api } = getEnv();

export const getBaseQuery = () =>
  fetchBaseQuery({
    baseUrl: api,
    prepareHeaders: (headers) => setAccessTokenToHeaders(headers),
  });

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: getBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ['Users', 'Projects', 'ProjectMembers', 'Tasks', 'Chats', 'Chat', 'Groups', 'Messages'],
  endpoints: () => ({}),
});
