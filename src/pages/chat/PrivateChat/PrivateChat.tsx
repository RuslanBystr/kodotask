import { SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Messages from '@/pages/chat/common/Messages';
import { useGetMessagesQuery } from '@/services/chat';
import { selectAuthenticatedUserSelector } from '@/store';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { Loading } from '@/ui-kit/loading/Loading';
import { getEnv } from '@/utils';

const { api } = getEnv();

const socket: Socket = io(api, { autoConnect: false });

export function PrivateChat() {
  const userData = useSelector(selectAuthenticatedUserSelector);
  const { id } = useParams();
  const chatId = id ?? '';
  const [newMessage, setNewMessage] = useState<string>('');
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<IMessageResponse[]>([]);
  const { data: initialMessages, isLoading, refetch } = useGetMessagesQuery({ chatId, page, limit: 20 });

  useEffect(() => {
    setMessages([]);
    setPage(1);

    refetch().then((response) => {
      if (response.data?.items) {
        setMessages(response.data.items);
      }
    });
  }, [chatId, refetch]);

  useEffect(() => {
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

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.emit('leaveChat', chatId);
    };
  }, [chatId]);

  useEffect(() => {
    if (initialMessages?.items) {
      setMessages((prevMessages) => {
        // Prevent duplicate messages
        const newMessages = initialMessages.items.filter((msg) => !prevMessages.some((prev) => prev.id === msg.id));
        return [...newMessages, ...prevMessages];
      });
    }
  }, [initialMessages]);

  const fetchMoreMessages = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  useEffect(() => {
    refetch().then((response) => {
      if (response.data?.items.length) {
        setMessages((prevMessages) => {
          const newMessages =
            response?.data?.items.filter((msg) => !prevMessages.some((prev) => prev.id === msg.id)) || [];
          return [...newMessages, ...prevMessages];
        });
      }
    });
  }, [page, refetch]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userData?.id,
      chatId,
      content: newMessage,
    };

    socket.emit('sendMessage', messageData);

    setNewMessage('');
  };

  return id ? (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-y-4">
      <div className="col-span-3 lg:col-span-2 flex flex-col p-2 h-full w-full">
        {messages.length > 0 ? (
          <Messages messageDetails={messages} fetchMoreMessages={fetchMoreMessages} />
        ) : (
          <div className="flex flex-col p-2 w-full justify-center h-[calc(100vh-142px)]">
            {isLoading ? (
              <div className="flex justify-center">
                <Loading />
              </div>
            ) : (
              <p className="text-center text-gray-400">No messages yet</p>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 border-t p-4">
          <Input
            className="flex-1"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button className="bg-card" onClick={sendMessage}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </div>
      <div className="hidden lg:block col-span-0 lg:col-span-1 p-2 w-full border-l bg-muted/30" />
    </div>
  ) : (
    <div className="flex justify-center items-center w-full h-full">Select a chat to start messaging</div>
  );
}
