import { io, Socket } from 'socket.io-client';

import { getEnv } from '@/utils';

const { api } = getEnv();
const token = localStorage.getItem('accessToken');

export const socket: Socket = io(api, {
  auth: {
    accessToken: token,
  },
});
