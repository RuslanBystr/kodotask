import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnlineUsersState {
  users: string[];
}

const initialState: OnlineUsersState = {
  users: [],
};

export const onlineUsersSlice = createSlice({
  name: 'onlineUsers',
  initialState,
  reducers: {
    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.users = action.payload;
    },
    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.users.includes(action.payload)) {
        state.users.push(action.payload);
      }
    },
    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((id) => id !== action.payload);
    },
  },
});

export const { setOnlineUsers, addOnlineUser, removeOnlineUser } = onlineUsersSlice.actions;
export default onlineUsersSlice.reducer;
