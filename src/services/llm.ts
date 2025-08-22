import { API_ROUTES } from '@/constants/api-routes';

import { baseApi } from './base';

export interface GenerateTextRequest {
  prompt: string;
  system?: string;
}

export interface GenerateTextResponse {
  generatedText: string;
}

export const llmApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    generateText: build.mutation<GenerateTextResponse, GenerateTextRequest>({
      query: (body) => ({
        url: `${API_ROUTES.LLM}/generate`,
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGenerateTextMutation } = llmApi;
