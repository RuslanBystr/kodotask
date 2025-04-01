import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_ROUTES } from '@/constants/api-routes';
import { getEnv, setAccessTokenToHeaders } from '@/utils';

const { api } = getEnv();

export const fileUploadApi = createApi({
  reducerPath: 'fileUploadApi',
  baseQuery: fetchBaseQuery({
    baseUrl: api,
    prepareHeaders: (headers) => setAccessTokenToHeaders(headers),
  }),
  endpoints: (builder) => ({
    uploadFile: builder.mutation({
      query: (data) => {
        const formData = new FormData();

        if (Array.isArray(data)) {
          data.filter((file) => file !== null).forEach((file) => formData.append('file', file));
        } else if (data !== null) {
          formData.append('file', data);
        }

        return {
          url: API_ROUTES.FILE,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadFileMutation } = fileUploadApi;
