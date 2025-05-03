import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef } from 'react';

import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { IUserResponse } from '@/types/responses/IUserResponse';
import { socket } from '@/utils/socket';

interface ChatMessageParams {
  chatId: string | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  setMessages: Dispatch<SetStateAction<IMessageResponse[]>>;
  userData: IUserResponse | null;
  refetchChats: () => void;
  setIsTyping: Dispatch<SetStateAction<boolean>>;
}

export const useChatMessage = ({
  refetchChats,
  chatId,
  setMessages,
  setPage,
  userData,
  setIsTyping,
}: ChatMessageParams) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNewMessage = useCallback(
    async (message: IMessageResponse) => {
      if ((message.chat.id as unknown as string) !== chatId) {
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
        setIsTyping(true);
      }

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 1600);
    },
    [userData?.id, setIsTyping],
  );

  const eventHandlers = useMemo(
    () => ({
      newMessage: handleNewMessage,
      updateMessage: updateMessageHandler,
      cleanMessage: removeMessageHandler,
      typing: handleTyping,
      messageRead: updateMessageHandler,
    }),
    [handleNewMessage, updateMessageHandler, removeMessageHandler, handleTyping],
  );

  useEffect(() => {
    if (!chatId) return undefined;

    setMessages([]);
    setPage(1);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit('joinChat', chatId);

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
  }, [chatId, eventHandlers, setMessages, setPage]);
};
