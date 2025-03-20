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

  const fetchMessages = useCallback(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    setLoading(true);

    const container = messagesContainerRef.current;
    if (!container) return;

    prevScrollHeight.current = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    fetchMoreMessages();

    setLoading(false);
    isFetching.current = false;

    const observer = new MutationObserver(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = previousScrollTop + (newScrollHeight - prevScrollHeight.current);
        prevScrollHeight.current = newScrollHeight;
      }
      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });
  }, [fetchMoreMessages]);

  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isFetching.current || loading) return;

    if (container.scrollTop === 0) {
      fetchMessages();
    }
  }, [fetchMessages, loading]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const isAtBottom = container.scrollHeight - (container.scrollTop + container.clientHeight) <= 200;

      if (isAtBottom) {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
      }
    });

    observer.observe(container);

    // eslint-disable-next-line consistent-return
    return () => observer.disconnect();
  }, [messageDetails]);

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
            className={clsx('ml-[13px] h-[14px] w-[15px]', {
              'animate-spin': loading,
            })}
          />
        </div>
      )}

      {messageDetails.map((message) => (
        <Message message={message} setMessages={setMessages} key={`${message.id}-${message.createdAt}`} />
      ))}
    </div>
  );
}

export default Messages;
