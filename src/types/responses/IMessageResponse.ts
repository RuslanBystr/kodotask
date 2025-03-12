import { IUserResponse } from '@/types/responses/IUserResponse';

export interface IMessageResponse {
  id: number;
  content: string;
  sender: Partial<IUserResponse>;
  chat: string;
  createdAt: Date;
  isRead: boolean;
}
