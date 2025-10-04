import { API_ROUTES } from '@/constants/api-routes';

import { baseApi } from './base';

export interface IIceResponse {
  iceServers: RTCIceServer[];
  ttl: number;
  expiry: number;
}

export const turnApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getIce: build.query<IIceResponse, void>({
      query: () => ({
        url: `${API_ROUTES.WEBRTC}/ice`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetIceQuery } = turnApi;
