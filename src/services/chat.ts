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
    getUserGroupChats: builder.query<IResponse<IChatResponse>, IChatRequestParams>({
      query: (params: IChatRequestParams) => ({
        url: `${API_ROUTES.CHATS}/groups`,
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

    createMessage: builder.mutation<IMessageResponse, unknown>({
      query: (body) => ({
        url: `${API_ROUTES.MESSAGES}`,
        body,
        method: 'POST',
      }),
    }),

    addReaction: builder.mutation<IMessageResponse, unknown>({
      query: ({ id, reaction }) => ({
        url: `${API_ROUTES.MESSAGES}/${id}`,
        body: { reaction },
        method: 'PUT',
      }),
    }),

    deletePrivateChat: builder.mutation<void, { chatId: number }>({
      query: (params) => ({
        url: `chats/${params.chatId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Chats', id: 'LIST' }],
    }),
    deleteMessage: builder.mutation<void, number | undefined>({
      query: (id) => ({
        url: `${API_ROUTES.MESSAGES}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Messages', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserChatsQuery,
  useGetUserGroupChatsQuery,
  useCreatePrivateChatMutation,
  useGetMessagesQuery,
  useDeletePrivateChatMutation,
  useDeleteMessageMutation,
  useGetMessageByIdQuery,
  useCreateMessageMutation,
  useAddReactionMutation,
} = messagesApi;
