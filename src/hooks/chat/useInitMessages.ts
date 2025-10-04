import { Dispatch, SetStateAction, useEffect } from 'react';

import { IResponse } from '@/types';
import { IMessageResponse } from '@/types/responses/IMessageResponse';

interface InitProps {
  initialMessages: IResponse<IMessageResponse> | undefined;
  setMessages: Dispatch<SetStateAction<IMessageResponse[]>>;
}
export const useInitMessages = ({ initialMessages, setMessages }: InitProps) => {
  useEffect(() => {
    if (initialMessages?.items) {
      setMessages((prevMessages) => {
        const newMessages = initialMessages.items.filter((msg) => !prevMessages.some((prev) => prev.id === msg.id));
        return [...newMessages, ...prevMessages];
      });
    }
  }, [initialMessages, setMessages]);
};
