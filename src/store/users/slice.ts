import { createSlice } from '@reduxjs/toolkit';

import type { IUsersState } from './types';

const initialState: IUsersState = {
  isDeleteUserModalOpen: false,
  selectedUserForModal: null,
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    openDeleteUserModal(state: IUsersState, { payload: user }) {
      state.isDeleteUserModalOpen = true;
      state.selectedUserForModal = user;
    },
    closeDeleteUserModal(state: IUsersState) {
      state.isDeleteUserModalOpen = false;
      state.selectedUserForModal = null;
    },
  },
});

export const { openDeleteUserModal, closeDeleteUserModal } = usersSlice.actions;

export default usersSlice.reducer;
