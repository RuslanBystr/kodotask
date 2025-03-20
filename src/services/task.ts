import { ITaskFormParams } from '@/components/forms/TaskForm/TaskForm';
import { API_ROUTES } from '@/constants/apiRoutes';
import { baseApi } from '@/services/base';
import { IRequestParams, IResponse } from '@/types';
import { ITaskLog, ITaskResponse } from '@/types/responses/IProjectResponse';

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<IResponse<ITaskResponse>, IRequestParams>({
      query: (params) => ({
        url: API_ROUTES.TASK,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Tasks' as const,
                id,
              })),
              { type: 'Tasks', id: 'LIST' },
            ]
          : [{ type: 'Tasks', id: 'LIST' }],
      keepUnusedDataFor: 1,
    }),
    getTaskById: builder.query<ITaskResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.TASK}/${id}`,
      }),
      providesTags: () => ['Tasks'],
    }),
    // set IUserFormParams
    editTask: builder.mutation<ITaskResponse, Partial<ITaskFormParams>>({
      query: ({ id, ...body }) => ({
        url: `${API_ROUTES.TASK}/${id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Tasks'],
    }),
    deleteTask: builder.mutation<void, string | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.TASK}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
    createTask: builder.mutation<ITaskResponse, unknown>({
      query: (body) => ({
        url: `${API_ROUTES.TASK}`,
        body,
        method: 'POST',
      }),
    }),
    spendTime: builder.mutation<ITaskResponse, { id: string; body: Partial<ITaskLog> }>({
      query: ({ id, body }: { id: string; body: Partial<ITaskLog> }) => ({
        url: `${API_ROUTES.TASK}/spend/${id}`,
        method: 'PUT',
        body,
      }),
    }),
    deleteTaskLog: builder.mutation<void, string | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.TASK}/logs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Tasks', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useDeleteTaskMutation,
  useGetTaskByIdQuery,
  useEditTaskMutation,
  useCreateTaskMutation,
  useSpendTimeMutation,
  useDeleteTaskLogMutation,
} = tasksApi;
