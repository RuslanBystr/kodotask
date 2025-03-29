import { IUserResponse } from '@/types/responses/IUserResponse';

export interface IMessageResponse {
  id: number;
  content: string;
  reaction: string;
  file: {
    uuid: string;
    createdAt: string;
  };
  voiceMessage: { uuid: string };
  linkToMessage: IMessageResponse | null;
  sender: Partial<IUserResponse>;
  chat: Chat;
  createdAt: Date;
  isRead: boolean;
  readByUsers: IUserResponse[];
}

export interface Chat {
  id: number;
  groupName: string;
  type: string;
}
