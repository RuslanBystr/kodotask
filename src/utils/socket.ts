import { io, Socket } from 'socket.io-client';

import { getEnv } from '@/utils';

const { api } = getEnv();

const wsApi = api.replace(/^http(s)?:\/\//, (match) => (match === 'https://' ? 'wss://' : 'ws://'));

export const socket: Socket = io(wsApi, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
  transports: ['websocket'],
});
