import { IUserResponse } from '@/types/responses/IUserResponse';

export interface IUsersState {
  isDeleteUserModalOpen: boolean;
  selectedUserForModal: IUserResponse | null;
}
