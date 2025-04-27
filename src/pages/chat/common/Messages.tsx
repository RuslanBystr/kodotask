import { clsx } from 'clsx';
import { useCallback, useEffect, useRef } from 'react';

import LoadingIcon from '@/assets/icons/LoadingIcon';
import { Message } from '@/pages/chat/common/Message';
import { IMessageResponse } from '@/types/responses/IMessageResponse';
import { Loading } from '@/ui-kit/loading/Loading';

interface MessagesProps {
  messageDetails: IMessageResponse[];
  fetchMoreMessages: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setReply: (reply: IMessageResponse) => void;
  typing: boolean;
}

function Messages({ messageDetails, loading, setLoading, fetchMoreMessages, setReply, typing }: MessagesProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const isFetching = useRef(false);

  const fetchMessages = useCallback(() => {
    if (isFetching.current) return;
    isFetching.current = true;
    const container = messagesContainerRef.current;
    if (!container) return;

    prevScrollHeight.current = container.scrollHeight;
    const previousScrollTop = container.scrollTop;

    fetchMoreMessages();

    isFetching.current = false;
    setLoading(false);

    const observer = new MutationObserver(() => {
      if (container) {
        const newScrollHeight = container.scrollHeight;
        container.scrollTop = previousScrollTop + (newScrollHeight - prevScrollHeight.current);
        prevScrollHeight.current = newScrollHeight;
      }
      observer.disconnect();
    });

    observer.observe(container, { childList: true, subtree: true });
  }, [fetchMoreMessages, setLoading]);

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
    container.scrollTop = (container.scrollHeight - container.clientHeight) / 2;

    setTimeout(() => {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth',
      });
    }, 100);
  }, [typing]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const isAtBottom = container.scrollHeight - (container.scrollTop + container.clientHeight) <= 170;

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

    setTimeout(() => observer.disconnect(), 500);
  }, [messageDetails.length]);

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleScroll}
      className="messages-container flex-1  overflow-y-auto p-4 space-y-2 h-[calc(100vh-142px)] custom-scrollbar"
    >
      {loading && (
        <div className="flex justify-center items-center text-center text-gray-400 p-2">
          <LoadingIcon className={clsx('mr-[13px] h-[14px] w-[15px] animate-spin')} />
          <p>Loading...</p>
        </div>
      )}
      {messageDetails.map((message) => (
        <Message message={message} key={`${message.id}-${message.createdAt}`} setReply={setReply} />
      ))}
      {typing && (
        <div className="flex justify-start items-center text-center text-gray-400 p-2">
          <Loading size={45} color="#a5d2dc" />
        </div>
      )}
    </div>
  );
}

export default Messages;
