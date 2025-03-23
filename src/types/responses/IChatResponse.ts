import { IMessageResponse } from '@/types/responses/IMessageResponse';

export interface IChatResponse {
  id: number;
  type: 'PRIVATE' | 'GROUP';
  groupName: string | null;
  lastMessage: IMessageResponse;
  userChats: IUserChat[];
  messages: IMessageResponse[];
}

export interface IUserChat {
  id: string;
  name: string;
  avatar: string;
  user: {
    id: string;
    firstName: string;
    avatar: string;
  };
}
