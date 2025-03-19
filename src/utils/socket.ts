import { io, Socket } from 'socket.io-client';

import { getEnv } from '@/utils';

const { api } = getEnv();
export const socket: Socket = io(api, { autoConnect: false });
