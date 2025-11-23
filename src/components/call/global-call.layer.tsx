import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { CallModal } from '@/components/modals/call-modal';
import VideoChat from '@/components/video-chat';
import { selectCall, setOpen } from '@/store/call';

export const GlobalCallLayer = () => {
  const dispatch = useDispatch();
  const { open, receiverId, chatId, incoming, initiator } = useSelector(selectCall);
  const onSetOpen = useCallback((v: boolean) => dispatch(setOpen(v)), [dispatch]);

  const lastRidRef = useRef<string | undefined>(receiverId);
  const lastCidRef = useRef<string | undefined>(chatId);

  useEffect(() => {
    if (receiverId) lastRidRef.current = receiverId;
    if (chatId) lastCidRef.current = chatId;
  }, [receiverId, chatId]);

  return (
    <CallModal open={open} setOpen={onSetOpen} renderTrigger={false} keepMounted>
      <VideoChat
        receiverId={lastRidRef.current!}
        chatId={lastCidRef.current!}
        open={open}
        setOpen={onSetOpen}
        incomingOffer={incoming?.offer}
        initiator={initiator}
      />
    </CallModal>
  );
};
