import { API_ROUTES } from '@/constants/api-routes';
import { IUserResponse } from '@/types/responses/IUserResponse';

import { baseApi } from './base';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (credentials) => ({
        url: `${API_ROUTES.AUTH}/login`,
        method: 'POST',
        body: credentials,
      }),
    }),
    signUp: build.mutation({
      query: (credentials) => ({
        url: `${API_ROUTES.AUTH}/register`,
        method: 'POST',
        body: credentials,
      }),
    }),
    getProfile: build.query<IUserResponse, string>({
      query: (token) => ({
        url: `${API_ROUTES.PROFILE}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useSignInMutation, useSignUpMutation, useGetProfileQuery } = authApi;
