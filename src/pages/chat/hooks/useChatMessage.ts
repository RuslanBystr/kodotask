import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { IChatResponse } from '@/types/responses/IChatResponse';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { socket } from '@/utils/socket';

interface ChatMessageParams {
  chatId: string | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  setMessages: Dispatch<SetStateAction<IMessageResponse[]>>;
  userData: IUserResponse | null;
  changeStatus: Dispatch<SetStateAction<string>>;
  activeChat: IChatResponse | null;
}

export const useChatMessage = ({
  activeChat,
  chatId,
  setMessages,
  setPage,
  userData,
  changeStatus,
}: ChatMessageParams) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!chatId) return;

    setMessages([]);
    setPage(1);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinChat', chatId);

    const handleNewMessage = (message: IMessageResponse) => {
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some((msg) => msg.id === message.id);
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    };

    const updateMessageHandler = (updateMessage: IMessageResponse) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updateMessage.id
            ? { ...msg, isRead: updateMessage.isRead, reaction: updateMessage.reaction }
            : msg,
        ),
      );
    };
    const removeMessageHandler = (removedMessage: IMessageResponse) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.createdAt !== removedMessage.createdAt));
    };

    const handleTyping = (userId: string) => {
      if (userData?.id !== Number(userId)) {
        changeStatus(`typing`);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        changeStatus('');
      }, 2000);
    };

    socket.off('updateMessage', updateMessageHandler);
    socket.off('newMessage', handleNewMessage);
    socket.off('cleanMessage', removeMessageHandler);
    socket.off('messageRead', updateMessageHandler);

    socket.on('updateMessage', updateMessageHandler);
    socket.on('cleanMessage', removeMessageHandler);
    socket.on('newMessage', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('messageRead', updateMessageHandler);

    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('updateMessage', updateMessageHandler);
      socket.off('cleanMessage', removeMessageHandler);
      socket.off('messageRead', updateMessageHandler);
      socket.off('typing', handleTyping);
      socket.emit('leaveChat', chatId);
    };
  }, [activeChat, changeStatus, chatId, setMessages, setPage, userData?.id]);
};
