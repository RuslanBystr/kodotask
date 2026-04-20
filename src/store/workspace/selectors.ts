import { RootState } from '@/store';

export const selectWorkspaceId = (state: RootState): string | null => state.workspace.currentWorkspaceId;
