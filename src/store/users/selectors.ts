import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

import type { IUsersState } from './types';

export const usersStateSelector = (state: RootState) => state.users;

export const selectedUserForModalSelector = createSelector(
  usersStateSelector,
  (state: IUsersState) => state.selectedUserForModal,
);

export const isDeleteUserModalOpenSelector = createSelector(
  usersStateSelector,
  (state: IUsersState) => state.isDeleteUserModalOpen,
);
