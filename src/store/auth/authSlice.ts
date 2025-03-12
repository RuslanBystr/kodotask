import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IUserResponse } from '@/types/responses/IUserResponse';
import { getAccessToken } from '@/utils';
import { removeAccessToken, setAccessTokenToStorage } from '@/utils/auth';

export interface IAuthState {
  accessToken: string | null;
  admin: IUserResponse | null;
}

const initialState: IAuthState = {
  accessToken: getAccessToken() ?? null,
  admin: null,
};

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAccessToken(
      state,
      action: PayloadAction<{
        token: string | null;
        admin: IUserResponse;
      }>,
    ) {
      setAccessTokenToStorage(action?.payload?.token as string);
      state.accessToken = action.payload.token;
      state.admin = action.payload.admin;
    },
    logout(state) {
      state.accessToken = null;
      state.admin = null;
      removeAccessToken();
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
