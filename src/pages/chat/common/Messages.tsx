import { clsx } from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';

import LoadingIcon from '@/assets/icons/LoadingIcon';
import { Message } from '@/pages/chat/common/Message';
import { IMessageResponse } from '@/types/responses/IMessageResponse';

interface MessagesProps {
  messageDetails: IMessageResponse[];
  fetchMoreMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<IMessageResponse[]>>;
}

function Messages({ messageDetails, setMessages, fetchMoreMessages }: MessagesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const [loading, setLoading] = useState(false);
  const isFetching = useRef(false);

  const fetchMessages = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    setLoading(true);
    const container = messagesContainerRef.current;
    if (!container) return;

    fetchMoreMessages();

    setLoading(false);
    isFetching.current = false;

    if (container) {
      container.scrollTop = container.scrollHeight - prevScrollHeight.current;
    }
    prevScrollHeight.current = container.scrollHeight;
  }, [fetchMoreMessages]);

  const handleScroll = useCallback(async () => {
    const container = messagesContainerRef.current;
    if (!container || isFetching.current || loading) return;

    if (container.scrollTop === 0) {
      await fetchMessages();
    }
  }, [fetchMessages, loading]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'instant',
      });
    }
  }, [messageDetails]);

  const handleDeleteMessage = (id: number) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
  };

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="messages-container flex-1 overflow-y-auto p-4 space-y-2 max-h-[calc(100vh-142px)] custom-scrollbar"
    >
      {loading && (
        <div className="flex justify-center text-center text-gray-400 p-2">
          Load more
          <LoadingIcon
            className={clsx(`ml-[13px] h-[14px] w-[15px]`, {
              'animate-spin': loading,
            })}
          />
        </div>
      )}

      {messageDetails.map((message) => (
        <Message message={message} onDelete={handleDeleteMessage} key={`${message.id}-${message.createdAt}`} />
      ))}
    </div>
  );
}

export default Messages;
