import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react';

import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { socket } from '@/utils/socket';

interface ChatMessageParams {
  chatId: string | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  setMessages: Dispatch<SetStateAction<IMessageResponse[]>>;
  userData: IUserResponse | null;
  changeStatus: Dispatch<SetStateAction<string>>;
  refetchChats: () => void;
}

export const useChatMessage = ({
  refetchChats,
  chatId,
  setMessages,
  setPage,
  userData,
  changeStatus,
}: ChatMessageParams) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNewMessage = useCallback(
    async (message: IMessageResponse) => {
      if (message.chat.id !== Number(chatId)) {
        refetchChats();
        return;
      }

      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some((msg) => msg.id === message.id);
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
      refetchChats();
    },
    [chatId, refetchChats, setMessages],
  );

  const updateMessageHandler = useCallback(
    (updateMessage: IMessageResponse) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === updateMessage.id
            ? {
                ...msg,
                isRead: updateMessage.isRead,
                readByUsers: updateMessage.readByUsers,
                reaction: updateMessage.reaction,
              }
            : msg,
        ),
      );
    },
    [setMessages],
  );

  const removeMessageHandler = useCallback(
    async (removedMessage: IMessageResponse) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== removedMessage.id));
      refetchChats();
    },
    [setMessages, refetchChats],
  );

  const handleTyping = useCallback(
    (userId: string) => {
      if (userData?.id !== Number(userId)) {
        changeStatus('typing');
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        changeStatus('');
      }, 1600);
    },
    [userData?.id, changeStatus],
  );

  useEffect(() => {
    if (!chatId) return undefined;

    setMessages([]);
    setPage(1);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinChat', chatId);

    const eventHandlers = {
      newMessage: handleNewMessage,
      updateMessage: updateMessageHandler,
      cleanMessage: removeMessageHandler,
      typing: handleTyping,
      messageRead: updateMessageHandler,
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.off(event, handler);
      socket.on(event, handler);
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      socket.emit('leaveChat', chatId);
    };
  }, [chatId, handleNewMessage, updateMessageHandler, removeMessageHandler, handleTyping, setMessages, setPage]);
};
