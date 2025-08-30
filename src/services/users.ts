import { API_ROUTES } from '@/constants/api-routes';
import { baseApi } from '@/services/base';
import { IRequestParams, IResponse, IUserFormParams } from '@/types';
import { IActivityResponse } from '@/types/responses/IActivityResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IResponse<IUserResponse>, IRequestParams>({
      query: (params) => ({
        url: API_ROUTES.MEMBERS,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Users' as const,
                id,
              })),
              { type: 'Users', id: 'LIST' },
            ]
          : [{ type: 'Users', id: 'LIST' }],
      keepUnusedDataFor: 1,
    }),
    getUserById: builder.query<IUserResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.USERS}/${id}`,
      }),
      providesTags: () => ['Users'],
    }),
    // set IUserFormParams
    editUser: builder.mutation<IUserResponse, IUserFormParams & { id: number }>({
      query: ({ id, ...body }) => ({
        url: `${API_ROUTES.USERS}/${id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Users'],
    }),
    deleteUser: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.USERS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    // set IUserFormParams
    createUser: builder.mutation<IUserResponse, unknown>({
      query: (body) => ({
        url: `${API_ROUTES.USERS}`,
        body,
        method: 'POST',
      }),
    }),
    blockUser: builder.mutation<void, { id: number; body: { isBlocked: boolean } }>({
      query: ({ id, body }) => ({
        url: `${API_ROUTES.USERS}/${id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Users'],
    }),
    getUserActivity: builder.query<IActivityResponse[], { userId: number | undefined }>({
      query: ({ userId }) => ({
        url: `${API_ROUTES.ACTIVITY}/${userId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useEditUserMutation,
  useCreateUserMutation,
  useBlockUserMutation,
  useGetUserActivityQuery,
} = usersApi;
