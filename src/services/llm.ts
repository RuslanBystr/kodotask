import { API_ROUTES } from '@/constants/api-routes';

import { baseApi } from './base';

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

export const llmApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
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
  }),
  overrideExisting: false,
});

export const { useChatWithThreadMutation, useGetChatHistoryQuery, useLazyGetChatHistoryQuery } = llmApi;
