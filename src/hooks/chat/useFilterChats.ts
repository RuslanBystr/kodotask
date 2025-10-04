import { ChangeEvent, useCallback, useState } from 'react';

import { IChatResponse } from '@/types/responses/IChatResponse';

export const useFilterChats = (chats: IChatResponse[] | undefined) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filterValue = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  }, []);

  const filteredChats = chats?.filter((chat) => {
    const chatName = chat?.groupName || chat?.userChats?.[0]?.name || '';
    return chatName.toLowerCase().includes(searchQuery);
  });

  return { filterValue, filteredChats };
};
