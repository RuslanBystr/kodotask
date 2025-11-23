import { PhoneCall } from 'lucide-react';
import { ReactNode, useMemo } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type CallPhase = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended';

export function CallModal({
  open,
  setOpen,
  children,
  renderTrigger = false,
  keepMounted = false,
  peerName,
  peerAvatarUrl,
  callState = 'idle',
  title,
  subtitle,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  children: ReactNode;
  renderTrigger?: boolean;
  keepMounted?: boolean;
  peerName?: string;
  peerAvatarUrl?: string;
  callState?: CallPhase;
  title?: string;
  subtitle?: string;
}) {
  const statusText = useMemo(() => {
    if (subtitle) return subtitle;
    switch (callState) {
      case 'calling':
        return 'Calling…';
      case 'incoming':
        return 'Incoming call…';
      case 'connected':
        return 'Connected';
      case 'ended':
        return 'Call ended';
      default:
        return 'Ready';
    }
  }, [callState, subtitle]);

  const headerTitle = title ?? (peerName ? `Call with ${peerName}` : 'Video call');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger && (
        <DialogTrigger asChild>
          <Button className="rounded-xl bg-[--main-button] px-4 py-2 flex items-center gap-2 transition-all hover:bg-[--main-button-hover] active:scale-95">
            <PhoneCall className="h-4 w-4" />
            Call
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        {...(keepMounted ? { forceMount: true } : {})}
        className="w-full max-w-4xl h-[75vh] md:h-[80vh] bg-[#233a47] rounded-xl p-0 md:p-4 text-white pointer-events-auto flex flex-col"
      >
        <DialogHeader className="flex items-center justify-between gap-3 p-4 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className="h-10 w-10 ring-1 ring-white/10">
              {peerAvatarUrl ? (
                <AvatarImage src={peerAvatarUrl} alt={peerName ?? 'Caller'} />
              ) : (
                <AvatarFallback className="bg-white/10 text-white/80">
                  <PhoneCall className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="min-w-0">
              <DialogTitle className="truncate">{headerTitle}</DialogTitle>
              <DialogDescription className="mt-0.5 flex items-center gap-2 text-xs text-white/70" aria-live="polite">
                <span
                  className={`inline-block h-2 w-2 rounded-full ${
                    // eslint-disable-next-line no-nested-ternary
                    callState === 'connected'
                      ? 'bg-emerald-500'
                      : // eslint-disable-next-line no-nested-ternary
                        callState === 'calling' || callState === 'incoming'
                        ? 'bg-amber-400'
                        : callState === 'ended'
                          ? 'bg-red-500'
                          : 'bg-white/40'
                  }`}
                />
                <span className="truncate">{statusText}</span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 p-2 md:p-3 pointer-events-auto">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
