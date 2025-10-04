import { useEffect } from 'react';

export const useFetchMessages = (chatId: string | undefined, page: number, refetch: () => void) => {
  useEffect(() => {
    if (!chatId) return;
    refetch();
  }, [chatId, refetch, page]);
};
