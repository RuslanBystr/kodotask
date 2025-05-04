'use client';

import { PhoneOff, VideoIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import { socket } from '@/utils/socket';

const VideoChat = ({
  receiverId,
  chatId,
  open,
  setOpen,
}: {
  receiverId: string;
  chatId: string;
  open: boolean;
  setOpen: (value: boolean) => void;
}) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');

  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ICE_SERVERS: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  const requestMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Media access error');
      setError('Failed to access camera/mic');
    }
  };

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        // eslint-disable-next-line prefer-destructuring
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('webrtc_signal', {
          toUserId: receiverId,
          chatId,
          signal: { candidate: event.candidate },
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'connected') {
        setCallState('connected');
      }
    };
    peerConnectionRef.current = pc;

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    return pc;
  }, [ICE_SERVERS, localStream, chatId, receiverId]);

  const handleCallUser = async () => {
    setCallState('calling');
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('webrtc_signal', {
      toUserId: receiverId,
      chatId,
      signal: { sdp: offer },
    });
  };

  useEffect(() => {
    socket.on('webrtc_signal', async ({ signal, fromUserId }) => {
      const pc = peerConnectionRef.current || createPeerConnection();

      if (signal?.sdp?.type === 'offer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc_signal', {
          toUserId: fromUserId,
          chatId,
          signal: { sdp: answer },
        });
      }

      if (signal?.sdp?.type === 'answer') {
        await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
      }

      if (signal?.candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
        } catch (err) {
          toast.error('Error adding ICE candidate');
        }
      }
    });

    return () => {
      socket.off('webrtc_signal');
    };
  }, [createPeerConnection, localStream, chatId]);

  useEffect(() => {
    requestMediaAccess();
  }, []);

  const handleHangUp = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
      setLocalStream(null);
    }

    setCallState('ended');
    setOpen(false);
    toast.info('Call ended', {
      style: {
        backgroundColor: 'rgba(53,71,101,0.8)',
        color: '#ffffff',
        fontSize: '16px',
        borderRadius: '0px',
        clipPath: `polygon(
            10px 0%,  
            calc(100% - 10px) 0%, 
            100% 10px,
            100% calc(100% - 10px), 
            calc(100% - 10px) 100%, 
            10px 100%, 
            0% calc(100% - 10px), 
            0% 10px
          )`,
      },
    });
  };

  return (
    <div className={open ? 'block' : 'hidden'}>
      {error && <div className="error-message">{error}</div>}
      {open && (
        <div className="video-container flex flex-col gap-4 rounded-md">
          <video ref={localVideoRef} autoPlay playsInline muted className="ml-auto w-1/2 max-h-[180px] border" />
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="max-h-[260px] md:max-h-[400px] max-w-full border rounded-md"
          />
        </div>
      )}
      <div className="flex justify-center mt-2">
        {callState === 'connected' ? (
          <Button
            className="bg-red-500 hover:bg-red-600 rounded-none cut cut-left-5 cut-right-5"
            onClick={handleHangUp}
          >
            <PhoneOff />
            End Call
          </Button>
        ) : (
          <Button
            className="mt-4 bg-[--main-button] rounded-none transition-all active:scale-95 cut cut-left-5 cut-right-5"
            onClick={handleCallUser}
          >
            <VideoIcon className="mr-2" />
            {callState === 'idle' ? 'Start Call' : 'Calling...'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoChat;
