import { IUserResponse } from '../responses/IUserResponse';

export type IUserFormParams = Pick<IUserResponse, 'firstName' | 'lastName' | 'email' | 'isBlocked'>;
