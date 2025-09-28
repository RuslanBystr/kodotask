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
  }, [receiverId]);

  useEffect(() => {
    if (chatId) lastCidRef.current = chatId;
  }, [chatId]);

  const effReceiverId = receiverId ?? incoming?.fromUserId ?? lastRidRef.current;
  const effChatId = chatId ?? incoming?.chatId ?? lastCidRef.current;

  return (
    <CallModal open={open} setOpen={onSetOpen} renderTrigger={false} keepMounted>
      {effReceiverId && effChatId ? (
        <VideoChat
          receiverId={effReceiverId}
          chatId={effChatId}
          open={open}
          setOpen={onSetOpen}
          incomingOffer={incoming?.offer}
          incomingFromUserId={incoming?.fromUserId}
          initiator={initiator}
        />
      ) : (
        <div className="p-4 text-sm opacity-70">Preparing call…</div>
      )}
    </CallModal>
  );
};
