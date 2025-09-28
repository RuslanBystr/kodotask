import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IncomingPayload = {
  chatId: string;
  fromUserId: string;
  offer?: RTCSessionDescriptionInit;
};

export type CallPhase = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

export type CallState = {
  open: boolean;
  receiverId?: string;
  chatId?: string;
  incomingModalOpen: boolean;
  incoming?: IncomingPayload | null;
  callState: CallPhase;
  initiator: boolean;
};

const initialState: CallState = {
  open: false,
  incomingModalOpen: false,
  incoming: null,
  callState: 'idle',
  initiator: false,
};

const slice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    openCall(state, action: PayloadAction<{ receiverId: string; chatId: string }>) {
      state.open = true;
      state.receiverId = action.payload.receiverId;
      state.chatId = action.payload.chatId;
      state.callState = 'calling';
      state.initiator = true;
    },
    acceptIncoming(state) {
      if (!state.incoming) return;
      state.open = true;
      state.receiverId = state.incoming.fromUserId;
      state.chatId = state.incoming.chatId;
    },

    setOpen(state, action: PayloadAction<boolean>) {
      state.open = action.payload;
    },

    showIncoming(state, action: PayloadAction<IncomingPayload>) {
      state.incomingModalOpen = true;
      state.incoming = action.payload;
      state.callState = 'incoming';
    },
    hideIncoming(state) {
      state.incomingModalOpen = false;
    },
    clearIncoming(state) {
      state.incomingModalOpen = false;
      state.incoming = null;
      if (state.callState === 'incoming') {
        state.callState = 'idle';
      }
    },
    setIncomingOffer(state, action: PayloadAction<RTCSessionDescriptionInit>) {
      if (state.incoming) state.incoming.offer = action.payload;
    },

    setConnected(state) {
      state.callState = 'connected';
      state.open = true;
    },
    endCall(state) {
      state.callState = 'ended';
      state.open = false;
      state.receiverId = undefined;
      state.chatId = undefined;
      state.incomingModalOpen = false;
      state.incoming = null;
      state.initiator = false;
    },
    resetCall(state) {
      state.open = false;
      state.receiverId = undefined;
      state.chatId = undefined;
      state.incomingModalOpen = false;
      state.incoming = null;
      state.callState = 'idle';
      state.initiator = false;
    },
  },
});

export const {
  openCall,
  setOpen,
  showIncoming,
  hideIncoming,
  clearIncoming,
  setIncomingOffer,
  setConnected,
  endCall,
  resetCall,
  acceptIncoming,
} = slice.actions;

export const callReducer = slice.reducer;
