import { IProjectFormParams } from '@/components/forms/ProjectForm/ProjectForm';
import { API_ROUTES } from '@/constants/apiRoutes';
import { baseApi } from '@/services/base';
import { IRequestParams, IResponse } from '@/types';
import { IProjectResponse } from '@/types/responses/IProjectResponse';

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<IResponse<IProjectResponse>, IRequestParams>({
      query: (params) => ({
        url: API_ROUTES.PROJECT,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Projects' as const,
                id,
              })),
              { type: 'Projects', id: 'LIST' },
            ]
          : [{ type: 'Projects', id: 'LIST' }],
      keepUnusedDataFor: 1,
    }),
    getProjectById: builder.query<IProjectResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.PROJECT}/${id}`,
      }),
      providesTags: () => ['Projects'],
    }),
    // set IUserFormParams
    editProject: builder.mutation<IProjectResponse, IProjectFormParams & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `${API_ROUTES.PROJECT}/${id}`,
        body,
        method: 'PUT',
      }),
      invalidatesTags: ['Projects'],
    }),
    deleteProject: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.PROJECT}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Projects', id: 'LIST' }],
    }),
    createProject: builder.mutation<IProjectResponse, unknown>({
      query: (body) => ({
        url: `${API_ROUTES.PROJECT}`,
        body,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
  useEditProjectMutation,
  useCreateProjectMutation,
} = projectsApi;
