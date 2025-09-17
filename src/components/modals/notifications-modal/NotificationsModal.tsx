import { Mail } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { getEnv } from '@/utils';

const { api } = getEnv();

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  severity?: 'info' | 'warning' | 'critical';
  createdAt: string;
};

type SystemEvent = { kind: 'notification:new'; payload: NotificationItem } | { kind: 'ping' };

export function NotificationsModal() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<NotificationItem[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const idsRef = useRef<Set<string>>(new Set());

  // 1) load initial messages when opened
  useEffect(() => {
    if (!open) return;
    (async () => {
      const res = await fetch(`${api}/notifications?take=20`, {
        credentials: 'include',
      });
      if (res.ok) {
        const list: NotificationItem[] = await res.json();
        idsRef.current = new Set(list.map((m) => m.id));
        setMessages(list); // triggers re-render
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      return;
    }

    const es = new EventSource(`${api}/notifications/me`, {
      withCredentials: true,
    });
    esRef.current = es;

    const handleSystem = (e: MessageEvent) => {
      try {
        const data: SystemEvent = JSON.parse(e.data);
        if (data.kind === 'notification:new') {
          const n = data.payload;
          if (!idsRef.current.has(n.id)) {
            idsRef.current.add(n.id);
            setMessages((prev) => [n, ...prev]);
          }
        }
      } catch {
        /* empty */
      }
    };

    es.addEventListener('system', handleSystem);
    es.onmessage = handleSystem;

    es.onerror = () => {};

    // eslint-disable-next-line consistent-return
    return () => {
      es.removeEventListener('system', handleSystem);
      es.close();
      esRef.current = null;
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton
          className="rounded-none select-none bg-transparent hover:bg-[#88aabb]"
          onClick={() => setOpen(true)}
        >
          <Mail className="mr-2" />
          Notification box
        </SidebarMenuButton>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[720px] bg-[--background] border-none rounded-none cut cut-left-10 cut-right-10">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>Box with notifications.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <div className="text-sm text-muted-foreground">No notifications yet.</div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="rounded-xl border p-3" data-severity={msg.severity}>
                <div className="text-sm font-medium">{msg.title}</div>
                {msg.body && <div className="text-sm mt-1 opacity-80">{msg.body}</div>}
                <div className="text-[11px] mt-1 opacity-60">{new Date(msg.createdAt).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
