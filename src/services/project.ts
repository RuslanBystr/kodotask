import { IProjectFormParams } from '@/components/forms/project/ProjectForm';
import { API_ROUTES } from '@/constants/api-routes';
import { baseApi } from '@/services/base';
import { IRequestParams, IResponse } from '@/types';
import { IProjectResponse } from '@/types/responses/IProjectResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';

export interface IAddProjectMemberDto {
  userId?: string;
  email?: string;
}

export interface IRemoveProjectMemberDto {
  userId: string;
}

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
    getMembers: builder.query<IResponse<IUserResponse>, { id: string }>({
      query: (params) => ({
        url: `${API_ROUTES.PROJECT}/${params.id}/members`,
        params,
      }),
    }),
    addMember: builder.mutation<IUserResponse, { id: string; body: IAddProjectMemberDto }>({
      query: ({ id, body }) => ({
        url: `${API_ROUTES.PROJECT}/${id}/members`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'ProjectMembers', id: arg.id }],
    }),

    removeMember: builder.mutation<void, { id: string; body: IRemoveProjectMemberDto }>({
      query: ({ id, body }) => ({
        url: `${API_ROUTES.PROJECT}/${id}/members`,
        method: 'DELETE',
        body,
      }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'ProjectMembers', id: arg.id }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useDeleteProjectMutation,
  useGetProjectByIdQuery,
  useEditProjectMutation,
  useCreateProjectMutation,
  useAddMemberMutation,
  useGetMembersQuery,
  useRemoveMemberMutation,
} = projectsApi;
