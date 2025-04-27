import { useEffect, useState } from 'react';

import { socket } from '@/utils/socket';

export const useUserConnection = ({ userId }: { userId: number | undefined }) => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    socket.emit('userConnected', userId);

    const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);

    socket.on('onlineUsers', handleOnlineUsers);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [userId]);

  return onlineUsers;
};
