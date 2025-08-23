import { API_ROUTES } from '@/constants/api-routes';

import { baseApi } from './base';

export interface CreateThreadRequest {
  title?: string;
  systemPrompt?: string;
}
export interface CreateThreadResponse {
  threadId: string;
  title: string | null;
  created_at: string;
}

export interface ChatWithThreadRequest {
  prompt: string;
  threadId?: string;
  systemPrompt?: string;
}
export interface ChatWithThreadResponse {
  reply: string;
  threadId: string;
}

export type ChatMessageRole = 'user' | 'model' | 'system';

export interface ChatMessageItem {
  id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string; // ISO
}

export interface ChatHistoryResponse {
  threadId: string;
  items: ChatMessageItem[];
  nextCursor?: string;
}
export interface ChatHistoryQuery {
  threadId: string;
  limit?: number;
  before?: string; // ISO
}

export interface FindThreadsQuery {
  offset?: number;
  limit?: number;
  q?: string;
}

export interface ThreadItem {
  id: string;
  title: string | null;
  system_prompt: string | null;
  summary: string | null;
  created_at: string; // ISO
  updated_at: string; // ISO
}

export interface FindThreadsResponse {
  total: number;
  items: ThreadItem[];
  nextOffset?: number;
  hasMore: boolean;
}

export const llmApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createThread: build.mutation<CreateThreadResponse, CreateThreadRequest | void>({
      query: (body) => ({
        url: `${API_ROUTES.LLM}/threads`,
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Threads', id: 'LIST' }],
    }),
    chatWithThread: build.mutation<ChatWithThreadResponse, ChatWithThreadRequest>({
      query: (body) => ({
        url: `${API_ROUTES.LLM}/chat`,
        method: 'POST',
        body,
      }),
    }),

    getChatHistory: build.query<ChatHistoryResponse, ChatHistoryQuery>({
      query: ({ threadId, limit = 30, before }) => ({
        url: `${API_ROUTES.LLM}/chat`,
        method: 'GET',
        params: {
          threadId,
          ...(limit ? { limit } : {}),
          ...(before ? { before } : {}),
        },
      }),
    }),
    findThreads: build.query<FindThreadsResponse, FindThreadsQuery | void>({
      query: (args) => {
        const { offset = 0, limit = 20, q } = args ?? {};
        return {
          url: `${API_ROUTES.LLM}/threads`,
          method: 'GET',
          params: { offset, limit, ...(q ? { q } : {}) },
        };
      },
      providesTags: (res) =>
        res
          ? [
              ...res.items.map((t) => ({ type: 'Threads' as const, id: t.id })),
              { type: 'Threads' as const, id: 'LIST' },
            ]
          : [{ type: 'Threads' as const, id: 'LIST' }],
    }),

    deleteThread: build.mutation<void, string>({
      query: (threadId) => ({
        url: `${API_ROUTES.LLM}/threads/${threadId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: 'Threads' as const, id },
        { type: 'Threads' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateThreadMutation,
  useFindThreadsQuery,
  useChatWithThreadMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useDeleteThreadMutation,
} = llmApi;
