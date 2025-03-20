import { API_ROUTES } from '@/constants/apiRoutes';
import { baseApi } from '@/services/base';
import { IChatRequestParams, IResponse } from '@/types';
import { IChatResponse } from '@/types/responses/IChatResponse';
import { IMessageResponse } from '@/types/responses/IMessageResponse';

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserChats: builder.query<IResponse<IChatResponse>, IChatRequestParams>({
      query: (params: IChatRequestParams) => ({
        url: `${API_ROUTES.CHATS}`,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Chats' as const,
                id,
              })),
              { type: 'Chats', id: 'LIST' },
            ]
          : [{ type: 'Chats', id: 'LIST' }],
      keepUnusedDataFor: 1,
    }),
    createPrivateChat: builder.mutation<IChatResponse, unknown>({
      query: ({ user1Id, user2Id }) => ({
        url: `chats/private`,
        body: { user1Id, user2Id },
        method: 'POST',
      }),
    }),
    getMessages: builder.query<IResponse<IMessageResponse>, IChatRequestParams>({
      query: (params) => ({
        url: `${API_ROUTES.MESSAGES}`,
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({
                type: 'Messages' as const,
                id,
              })),
              { type: 'Messages', id: 'LIST' },
            ]
          : [{ type: 'Messages', id: 'LIST' }],
      keepUnusedDataFor: 1,
    }),
    getMessageById: builder.query<IMessageResponse, string>({
      query: (id) => ({
        url: `${API_ROUTES.MESSAGES}/${id}`,
      }),
      providesTags: () => ['Messages'],
    }),
    deleteMessage: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.MESSAGES}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Messages', id: 'LIST' }],
    }),
    addReaction: builder.mutation<IMessageResponse, unknown>({
      query: ({ id, reaction }) => ({
        url: `${API_ROUTES.MESSAGES}/${id}`,
        body: { reaction },
        method: 'PUT',
      }),
    }),
    createMessage: builder.mutation<IMessageResponse, unknown>({
      query: (body) => ({
        url: `${API_ROUTES.MESSAGES}`,
        body,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useCreatePrivateChatMutation,
  useGetMessagesQuery,
  useDeleteMessageMutation,
  useGetMessageByIdQuery,
  useCreateMessageMutation,
  useAddReactionMutation,
} = messagesApi;
