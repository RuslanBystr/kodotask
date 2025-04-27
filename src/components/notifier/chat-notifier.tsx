import { useEffect } from 'react';
import { toast } from 'react-toastify';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getEnv } from '@/utils';
import { socket } from '@/utils/socket';

const { api } = getEnv();

export const ChatNotifier = () => {
  useEffect(() => {
    socket.on('notifyNewMessage', (message) => {
      toast(
        <div className="flex gap-2">
          <div className="flex items-end mr-1">
            <Avatar className="size-9">
              <AvatarFallback>{message?.sender?.firstName?.[0] || 'U'}</AvatarFallback>
              <AvatarImage src={`${api}/file/${message.sender.avatar}`} alt={message.sender.firstName} />
            </Avatar>
          </div>
          <div>
            <p className="text-[12px] text-green-100">{message.sender.firstName}</p>
            <p className="text-sm break-all">{message.content}</p>
          </div>
        </div>,
        {
          position: 'bottom-right',
          autoClose: 5000,
          style: {
            padding: '5px',
            borderBottomLeftRadius: 15,
            borderTopLeftRadius: 15,
            border: '2px solid #4FA3B8',
            backgroundColor: '#2C3E50',
            color: '#fff',
          },
        },
      );
    });

    return () => {
      socket.off('notifyNewMessage');
    };
  }, []);

  return null;
};
