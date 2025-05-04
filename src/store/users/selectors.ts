import { RootState } from '@/store';

export const selectOnlineUsers = (state: RootState) => state.onlineUsers.users;
