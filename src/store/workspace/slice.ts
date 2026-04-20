import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WorkspaceState {
  currentWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  currentWorkspaceId: null,
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setWorkspace(state, action: PayloadAction<string>) {
      state.currentWorkspaceId = action.payload;
    },
    clearWorkspace(state) {
      state.currentWorkspaceId = null;
    },
  },
});

export const { setWorkspace, clearWorkspace } = workspaceSlice.actions;

export default workspaceSlice.reducer;
