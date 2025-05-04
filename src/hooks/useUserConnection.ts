import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setOnlineUsers } from '@/store/users';
import { socket } from '@/utils/socket';

export const useUserConnection = ({ userId }: { userId: number | undefined }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userId) return;

    socket.emit('userConnected', userId);

    const handleOnlineUsers = (users: string[]) => {
      dispatch(setOnlineUsers(users));
    };

    socket.on('onlineUsers', handleOnlineUsers);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('onlineUsers', handleOnlineUsers);
    };
  }, [userId, dispatch]);
};
