'use client';

import { MessageSquare, Mic, MonitorUp, PhoneOff, Settings, Video } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { useDraggableInContainer } from '@/hooks/useDraggableInContainer';
import { useLocalMedia } from '@/hooks/useLocalMedia';
import { useTurnCredentials } from '@/hooks/useTurnCredentials';
import { endCall, setConnected } from '@/store/call';
import { socket } from '@/utils/socket';

type WebRTCSignalMinimal = {
  type?: 'ring' | 'end';
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit | null;
};

type WebRTCMessageMinimal = {
  signal: WebRTCSignalMinimal;
  fromUserId: string;
};

const VideoChat = ({
  receiverId,
  chatId,
  open,
  setOpen,
  incomingOffer,
  incomingFromUserId,
  initiator,
}: {
  receiverId: string;
  chatId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  incomingOffer: RTCSessionDescriptionInit | undefined;
  incomingFromUserId: string | undefined;
  initiator: boolean;
}) => {
  const dispatch = useDispatch();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [callState, setCallState] = useState<'idle' | 'calling' | 'incoming' | 'connected' | 'ended'>('idle');

  const callStateRef = useRef(callState);
  const acceptingRef = useRef(false);

  const pendingOfferRef = useRef<RTCSessionDescriptionInit | null>(null);
  const pendingFromUserRef = useRef<string | null>(null);
  const endByPeerRef = useRef(false);

  const acceptedFromPropsRef = useRef(false);

  const candidateQueueRef = useRef<(RTCIceCandidateInit | null)[]>([]);
  const remoteDescSetRef = useRef(false);

  const areaRef = useRef<HTMLDivElement>(null);
  const {
    nodeRef: pipRef,
    style: pipStyle,
    onPointerDown,
  } = useDraggableInContainer<HTMLDivElement>(areaRef, {
    marginX: 8,
    marginY: 18,
    // persistKey: 'pip-pos',
  });

  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  const { iceServers, error: turnErr, ensureReady } = useTurnCredentials();

  useEffect(() => {
    if (turnErr) toast.error('TURN credentials error. Falling back to STUN.');
  }, [turnErr]);

  const { stream: localStream, error: mediaError, acquire, attach, release } = useLocalMedia();

  useEffect(() => {
    if (mediaError) toast.error('Media access error');
  }, [mediaError]);

  useEffect(() => {
    if (localStream) {
      attach(localVideoRef.current);
    }
  }, [localStream, attach]);

  const handleHangUp = useCallback(
    (sendSignal = true) => {
      try {
        if (sendSignal) {
          socket.emit('webrtc_signal', {
            toUserId: receiverId,
            chatId,
            signal: { type: 'end' },
          });
        }

        if (peerConnectionRef.current) {
          try {
            peerConnectionRef.current.getSenders?.().forEach((s) => s.replaceTrack?.(null));
            peerConnectionRef.current.getTransceivers?.().forEach((t) => t.stop?.());
          } catch {
            /* empty */
          }

          peerConnectionRef.current.ontrack = null;
          peerConnectionRef.current.onicecandidate = null;
          peerConnectionRef.current.onconnectionstatechange = null;
          peerConnectionRef.current.onsignalingstatechange = null;
          peerConnectionRef.current.onicecandidateerror = null;
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }

        remoteDescSetRef.current = false;
        candidateQueueRef.current = [];

        release();
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;

        acceptedFromPropsRef.current = false;
        setCallState('ended');
        setOpen(false);
      } catch {
        acceptedFromPropsRef.current = false;
        setCallState('ended');
        setOpen(false);
      }
    },
    [release, setOpen, receiverId, chatId],
  );

  const createPeerConnection = useCallback(
    (stream?: MediaStream) => {
      const pc = new RTCPeerConnection({
        iceServers: [
          ...iceServers,
          { urls: 'stun:stun.l.google.com:19302' }, // fallback STUN
        ],
        iceTransportPolicy: 'all', // all = STUN + TURN
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
      });

      const s = stream ?? localStream;
      if (s) {
        s.getTracks().forEach((t) => pc.addTrack(t, s));
      } else {
        pc.addTransceiver('audio', { direction: 'recvonly' });
        pc.addTransceiver('video', { direction: 'recvonly' });
      }

      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          // eslint-disable-next-line prefer-destructuring
          remoteVideoRef.current.srcObject = event.streams[0];
          remoteVideoRef.current.play?.().catch(() => {});
        }
      };

      pc.onicecandidate = (event) => {
        const payload = event.candidate?.toJSON?.() ?? event.candidate ?? null;
        if (payload) {
          socket.emit('webrtc_signal', { toUserId: receiverId, chatId, signal: { candidate: payload } });
        }
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'connected') {
          setCallState('connected');
          dispatch(setConnected());
        }
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          handleHangUp(false);
          dispatch(endCall());
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'closed') {
          handleHangUp(false);
          dispatch(endCall());
        }
      };

      pc.onsignalingstatechange = () => {
        if (pc.signalingState === 'closed') {
          handleHangUp(false);
          dispatch(endCall());
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [iceServers, localStream, receiverId, chatId, dispatch, handleHangUp],
  );

  const drainCandidateQueue = useCallback(async (pc: RTCPeerConnection) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const c of candidateQueueRef.current) {
      try {
        // eslint-disable-next-line no-await-in-loop
        await pc.addIceCandidate(c ? new RTCIceCandidate(c) : undefined);
      } catch (err) {
        /* empty */
      }
    }
    candidateQueueRef.current = [];
  }, []);

  const handleCallUser = useCallback(async () => {
    if (!initiator) return;
    await ensureReady();
    const stream = await acquire();
    if (!stream) return;

    remoteDescSetRef.current = false;
    candidateQueueRef.current = [];

    setCallState('calling');
    setOpen(true);

    const pc = createPeerConnection(stream);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('webrtc_signal', {
      toUserId: receiverId,
      chatId,
      signal: { type: 'ring' },
    });

    socket.emit('webrtc_signal', {
      toUserId: receiverId,
      chatId,
      signal: { sdp: offer },
    });
  }, [initiator, ensureReady, acquire, setOpen, createPeerConnection, receiverId, chatId]);

  const handleAcceptIncoming = useCallback(async () => {
    if (initiator) return;
    await ensureReady();
    const offer = pendingOfferRef.current;
    const from = pendingFromUserRef.current;
    if (!offer || !from) return;
    if (remoteDescSetRef.current || peerConnectionRef.current?.remoteDescription) return;
    if (acceptingRef.current) return;
    if (remoteDescSetRef.current || peerConnectionRef.current?.remoteDescription) return;
    acceptingRef.current = true;

    let stream = localStream;
    if (!stream) {
      stream = await acquire();
      if (!stream) {
        acceptingRef.current = false;
        return;
      }
    }

    const pc = peerConnectionRef.current || createPeerConnection(stream);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    remoteDescSetRef.current = true;

    await drainCandidateQueue(pc);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit('webrtc_signal', {
      toUserId: from,
      chatId,
      signal: { sdp: answer },
    });

    pendingOfferRef.current = null;
    acceptingRef.current = false;
  }, [initiator, ensureReady, localStream, createPeerConnection, drainCandidateQueue, chatId, acquire]);

  useEffect(() => {
    if (!open) return;
    if (!incomingOffer || !incomingFromUserId) return;
    if (acceptedFromPropsRef.current) return;
    if (remoteDescSetRef.current) return;

    pendingOfferRef.current = incomingOffer;
    pendingFromUserRef.current = incomingFromUserId;

    if (!localStream) {
      acquire().finally(() => {
        acceptedFromPropsRef.current = true;
        Promise.resolve().then(() => handleAcceptIncoming());
      });
    } else {
      acceptedFromPropsRef.current = true;
      Promise.resolve().then(() => handleAcceptIncoming());
    }
  }, [open, incomingOffer, incomingFromUserId, localStream, handleAcceptIncoming, acquire, setOpen]);

  useEffect(() => {
    const handler = async ({ signal, fromUserId }: WebRTCMessageMinimal) => {
      const pc = peerConnectionRef.current;

      if (!pc) return;

      if ('candidate' in (signal ?? {})) {
        const cand = signal.candidate as RTCIceCandidateInit | null;
        if (!remoteDescSetRef.current || !pc.remoteDescription) {
          candidateQueueRef.current.push(cand);
        } else {
          try {
            await pc.addIceCandidate(cand ? new RTCIceCandidate(cand) : undefined);
          } catch {
            toast.error('Error adding ICE candidate');
          }
        }
        return;
      }

      if (signal?.type === 'end') {
        endByPeerRef.current = true;
        handleHangUp(false);
        return;
      }

      if (signal?.sdp?.type === 'offer') {
        pendingOfferRef.current = signal.sdp;
        pendingFromUserRef.current = fromUserId;

        return;
      }

      if (signal?.sdp?.type === 'answer') {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const pc = peerConnectionRef.current;
        if (!pc) return;
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        remoteDescSetRef.current = true;
        await drainCandidateQueue(pc);
        return;
      }

      if ('candidate' in (signal ?? {})) {
        const cand = signal.candidate as RTCIceCandidateInit | null;

        if (!remoteDescSetRef.current || !peerConnectionRef.current?.remoteDescription) {
          candidateQueueRef.current.push(cand);
          return;
        }

        try {
          await peerConnectionRef.current!.addIceCandidate(cand ? new RTCIceCandidate(cand) : undefined);
        } catch {
          toast.error('Error adding ICE candidate');
        }
        candidateQueueRef.current = [];
      }
    };

    socket.on('webrtc_signal', handler);
    return () => {
      socket.off('webrtc_signal', handler);
    };
  }, [localStream, acquire, createPeerConnection, handleHangUp, chatId, drainCandidateQueue]);

  return (
    <>
      <section
        className={`relative w-full rounded-none border bg-neutral-900/60 text-white overflow-hidden
                  ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  transition-opacity duration-200`}
      >
        {/* Top panel (status + time) */}
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-2 px-2
                      bg-gradient-to-b from-black/50 to-transparent"
        >
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="capitalize">
              {callState === 'idle' && 'idle'}
              {callState === 'calling' && 'calling…'}
              {callState === 'incoming' && 'incoming…'}
              {callState === 'connected' && 'connected'}
              {callState === 'ended' && 'ended'}
            </span>
          </div>
          <div className="text-xs md:text-sm tabular-nums opacity-80">00:00</div>
        </div>

        {/* Remote video */}
        <div ref={areaRef} className="relative w-full bg-black/30">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={remoteVideoRef} autoPlay playsInline className="h-[64vh] w-full object-contain md:object-cover" />
          {/* Local video */}
          <div ref={pipRef} style={pipStyle} onPointerDown={onPointerDown} className="z-20 select-none">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-28 h-20 md:w-40 md:h-28 rounded-lg border border-white/20 shadow-xl object-cover bg-black/60"
            />
          </div>
        </div>

        {/* Bottom control panel */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-2 md:p-3 pointer-events-none">
          <div className="relative mx-auto w-full max-w-2xl rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 px-3 py-2 md:px-4 md:py-3 pointer-events-auto">
            {callState === 'connected' ? (
              <div className="relative flex items-center justify-between">
                {/* Ліва група */}
                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => {}}
                    aria-label="Mute mic"
                    title="Mute mic"
                  >
                    <Mic className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => {}}
                    aria-label="Toggle camera"
                    title="Toggle camera"
                  >
                    <Video className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2">
                  <Button
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-900/30"
                    onClick={() => handleHangUp(true)}
                    aria-label="End call"
                    title="End call"
                  >
                    <PhoneOff className="h-5 w-5 md:h-6 md:w-6" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    variant="ghost"
                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => {}}
                    aria-label="Share screen"
                    title="Share screen"
                  >
                    <MonitorUp className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="h-10 w-10 md:h-11 md:w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => {}}
                    aria-label="Open chat"
                    title="Open chat"
                  >
                    <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  <Button
                    variant="ghost"
                    className="hidden sm:inline-flex h-10 w-10 md:h-11 md:w-11 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
                    onClick={() => {}}
                    aria-label="Settings"
                    title="Settings"
                  >
                    <Settings className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Button
                  className="h-9 md:h-10 min-w-[140px] rounded-xl bg-[--main-button] hover:bg-[--main-button-hover] transition active:scale-95"
                  onClick={handleCallUser}
                  disabled={callState === 'calling' || callState === 'incoming'}
                  aria-disabled={callState === 'calling' || callState === 'incoming'}
                  aria-label="Start call"
                >
                  <Video className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                  {callState === 'idle' && 'Start Call'}
                  {callState === 'calling' && 'Calling…'}
                  {callState === 'incoming' && 'Incoming…'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-2 h-6" />
    </>
  );
};

export default VideoChat;
