import { Workspace } from '@/store/workspace/types';
import { IFileEntityResponse } from '@/types/responses/IFileEntityResponse';

export interface IUserResponse {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  avatar?: IFileEntityResponse;
  phone: string;
  isBlocked?: boolean;
  workspaces: Workspace[]; // TODO
}
