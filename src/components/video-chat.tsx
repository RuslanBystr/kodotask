'use client';

import { MessageSquare, Mic, MonitorUp, PhoneOff, Settings, Video } from 'lucide-react';
import { useRef } from 'react';

import { useDraggableInContainer } from '@/hooks/useDraggableInContainer';

import { Button } from './ui/button';

interface VideoChatProps {
  receiverId: string;
  chatId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  incomingOffer?: RTCSessionDescriptionInit;
  initiator: boolean;
}

const VideoChat: React.FC<VideoChatProps> = ({ open, initiator }) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const {
    nodeRef: pipRef,
    style: pipStyle,
    onPointerDown,
  } = useDraggableInContainer<HTMLDivElement>(areaRef, { marginX: 8, marginY: 18 });

  return (
    <section
      className={`relative max-w-4xl h-[60vh] rounded-xl bg-neutral-900/60 text-white overflow-hidden transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      {...(!open ? { inert: true } : {})}
    >
      {/* Status */}
      <div className="absolute top-3 left-3 text-sm md:text-base flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          Call status: <b>{initiator ? 'Ready to call' : 'Waiting'}</b>
        </span>
      </div>

      {/* Video area placeholder */}
      <div ref={areaRef} className="flex items-center justify-center w-full h-full bg-black/40 relative">
        <span className="text-white/60 text-lg md:text-xl">Video Area</span>

        {/* Local PIP */}
        <div
          ref={pipRef}
          style={pipStyle}
          onPointerDown={onPointerDown}
          className="absolute bottom-4 right-4 w-32 h-24 md:w-40 md:h-28 rounded-lg border border-white/20 shadow-xl bg-black/60 flex items-center justify-center text-white/50 cursor-move select-none"
        >
          Local Video
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 md:gap-4">
        <Button variant="ghost" className="h-10 w-10 border hover:bg-main-button/20">
          <Mic />
        </Button>
        <Button variant="ghost" className="h-10 w-10 border hover:bg-main-button/20">
          <Video />
        </Button>
        <Button className="h-10 w-10 bg-destructive text-destructive-foreground hover:bg-destructive/80">
          <PhoneOff />
        </Button>
        <Button variant="ghost" className="h-10 w-10 border hover:bg-main-button/20">
          <MonitorUp />
        </Button>
        <Button variant="ghost" className="h-10 w-10 border hover:bg-main-button/20">
          <MessageSquare />
        </Button>
        <Button variant="ghost" className="h-10 w-10 border hover:bg-main-button/20">
          <Settings />
        </Button>
      </div>
    </section>
  );
};

export default VideoChat;
