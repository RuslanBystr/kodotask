import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import { CallPhase, CallState } from '@/store/call/callSlice';

export const selectCall = (state: RootState): CallState => state.call;

export const selectCallOpen = (state: RootState): boolean => state.call.open;

export const selectIncoming = (state: RootState): CallState['incoming'] => state.call.incoming;

export const selectIncomingOpen = (state: RootState): boolean => state.call.incomingModalOpen;

export const selectCallState = (state: RootState): CallPhase => state.call.callState;

export const selectIsInCall = createSelector(selectCallState, (phase) => phase === 'connected');

export const selectIsDialing = createSelector(selectCallState, (phase) => phase === 'calling' || phase === 'incoming');
