import { IUserResponse } from '@/types/responses/IUserResponse';

export interface ISignInResponse {
  token: string;
  admin: IUserResponse;
}
