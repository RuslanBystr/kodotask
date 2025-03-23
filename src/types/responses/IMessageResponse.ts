import { IUserResponse } from '@/types/responses/IUserResponse';

export interface IMessageResponse {
  id: number;
  content: string;
  reaction: string;
  voiceMessage: { uuid: string };
  sender: Partial<IUserResponse>;
  chat: Chat;
  createdAt: Date;
  isRead: boolean;
}

export interface Chat {
  id: number;
  groupName: string;
  type: string;
}
