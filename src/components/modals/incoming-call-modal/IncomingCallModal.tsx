import { Phone, PhoneOff } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { useGetUserByIdQuery } from '@/services/users';
import { acceptIncoming, clearIncoming, hideIncoming, selectIncoming, selectIncomingOpen } from '@/store/call';
import { socket } from '@/utils/socket';

export const IncomingCallModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIncomingOpen);
  const incoming = useSelector(selectIncoming);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const callerId = incoming?.fromUserId ?? '';
  const skipQuery = !mounted || !isOpen || !callerId;

  const { data: caller } = useGetUserByIdQuery(callerId, { skip: skipQuery });

  const displayName = useMemo(() => {
    if (!caller) return callerId ? `User #${callerId}` : 'Unknown user';
    return caller.firstName && caller.lastName
      ? `${caller.firstName} ${caller.lastName}`
      : caller.firstName || caller.userName || `User #${callerId}`;
  }, [caller, callerId]);

  const handleDecline = useCallback(() => {
    if (!incoming) return;
    socket.emit('webrtc_signal', {
      toUserId: incoming.fromUserId,
      chatId: incoming.chatId,
      signal: { type: 'end' },
    });
    dispatch(clearIncoming());
  }, [dispatch, incoming]);

  const handleAccept = useCallback(() => {
    if (!incoming) return;
    socket.emit('joinChat', String(incoming.chatId));

    dispatch(acceptIncoming());
    dispatch(hideIncoming());
  }, [dispatch, incoming]);

  if (!mounted || !isOpen || !incoming) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Incoming call"
        className="relative z-10 w-[92%] max-w-sm rounded-2xl border border-white/10 bg-gradient-to-b from-[#111827]/90 to-[#0b1220]/90 text-white shadow-2xl p-5"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-white/10 border border-white/10 grid place-items-center shadow-lg">
              <Phone className="h-6 w-6 opacity-80 -scale-x-100" />
            </div>
            <span className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-white/10 animate-ping" />
          </div>

          <div className="space-y-1">
            <p className="text-sm uppercase tracking-widest text-white/70">Incoming call</p>
            <p className="text-lg font-semibold">{displayName}</p>
          </div>

          <div className="mt-5 flex w-full items-center justify-center gap-4">
            <Button
              onClick={handleDecline}
              className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-900/30"
              aria-label="Decline call"
              title="Decline"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>

            <Button
              onClick={handleAccept}
              className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-900/30"
              aria-label="Accept call"
              title="Accept"
            >
              <Phone className="h-5 w-5 -scale-x-100" />
            </Button>
          </div>

          <p className="mt-4 text-xs text-white/60">Press Enter to accept or Esc to decline</p>
        </div>
      </div>
    </div>,
    document.body,
  );
};
