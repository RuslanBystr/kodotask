import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { selectAuthenticatedUserSelector } from '@/store';
import {
  clearIncoming,
  endCall,
  selectCall,
  selectCallState,
  selectIncomingOpen,
  setIncomingOffer,
  showIncoming,
} from '@/store/call';
import { socket } from '@/utils/socket';

type WebRTCSignal = { type: 'ring' } | { type: 'end' } | { sdp: RTCSessionDescriptionInit };
type WebRTCBridgeMsg = {
  signal: WebRTCSignal;
  fromUserId: string;
  chatId: string;
};

export const CallSocketBridge = () => {
  const dispatch = useDispatch();
  const incomingOpen = useSelector(selectIncomingOpen);
  const callState = useSelector(selectCallState);
  const { open: callOpen, chatId: activeChatId } = useSelector(selectCall);
  const authUser = useSelector(selectAuthenticatedUserSelector);

  useEffect(() => {
    const onSignal = ({ signal, fromUserId, chatId }: WebRTCBridgeMsg) => {
      if (authUser && String(authUser.id) === String(fromUserId)) return;

      const busy = callOpen || callState === 'calling' || callState === 'connected';

      if ('type' in signal && signal.type === 'ring') {
        if (!busy) dispatch(showIncoming({ chatId, fromUserId }));
        return;
      }

      if ('type' in signal && signal.type === 'end') {
        if (incomingOpen) dispatch(clearIncoming());
        if (callOpen || callState === 'connected' || callState === 'calling') {
          dispatch(endCall());
        }
        return;
      }

      if ('sdp' in signal && signal.sdp?.type === 'offer') {
        if (busy && activeChatId && String(activeChatId) !== String(chatId)) return;

        if (incomingOpen) {
          dispatch(setIncomingOffer(signal.sdp));
        } else {
          dispatch(showIncoming({ chatId, fromUserId, offer: signal.sdp }));
        }
      }
    };

    socket.on('webrtc_signal', onSignal);
    return () => {
      socket.off('webrtc_signal', onSignal);
    };
  }, [dispatch, incomingOpen, callOpen, callState, activeChatId, authUser]);

  return null;
};
