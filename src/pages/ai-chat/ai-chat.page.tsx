import { Loader2, MessageSquare, Paperclip, RefreshCw, Search, Send, Sparkles, Trash2, X } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { RightSidebar } from '@/components/right-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Bubble } from '@/pages/ai-chat/Buuble';
import {
  useChatWithThreadMutation,
  useCreateThreadMutation,
  useDeleteThreadMutation,
  useFindThreadsQuery,
  useLazyGetChatHistoryQuery,
} from '@/services/llm';
import { cn } from '@/utils/utils';

export type AIUserRole = 'user' | 'assistant' | 'system';

interface AIMessage {
  id: string;
  role: AIUserRole;
  content: string;
}

const mapToAIMessage = (m: { id: string; role: 'user' | 'model' | 'system'; content: string }): AIMessage => ({
  id: m.id,
  role: m.role === 'model' ? 'assistant' : (m.role as AIUserRole),
  content: m.content,
});

function shortId(id: string) {
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export default function AIChat() {
  const { threadId: paramId } = useParams();
  const { isMobile } = useSidebar();
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  const [createThread, { isLoading: creating }] = useCreateThreadMutation();
  const [chatWithThread, { isLoading: isChatLoading }] = useChatWithThreadMutation();
  const [fetchHistory] = useLazyGetChatHistoryQuery();
  const [q, setQ] = useState('');
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data: threads, isLoading, isFetching, refetch } = useFindThreadsQuery({ offset, limit, q });

  const [deleteThread, { isLoading: deleting }] = useDeleteThreadMutation();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const justSwitchedRef = useRef(false);

  useEffect(() => {
    if (paramId) setThreadId(paramId);
  }, [paramId]);

  useEffect(() => {
    if (threadId) justSwitchedRef.current = true;
  }, [threadId]);

  const scrollToBottom = (smooth = true) => {
    const vp = scrollRootRef.current?.querySelector('[data-radix-scroll-area-viewport]') as HTMLDivElement | null;
    if (vp) vp.scrollTo({ top: vp.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (!threadId) return;
    (async () => {
      try {
        const res = await fetchHistory({ threadId, limit: 30 }).unwrap();
        setMessages(res.items.map(mapToAIMessage));
      } catch {
        toast.error('Failed to load chat history');
      }
    })();
  }, [threadId, fetchHistory]);

  useLayoutEffect(() => {
    if (!messages.length) return;
    const smooth = !justSwitchedRef.current;
    scrollToBottom(smooth);
    justSwitchedRef.current = false;
  }, [messages.length]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading && !isChatLoading, [input, loading, isChatLoading]);

  const sendMessage = useCallback(async () => {
    if (!canSend) return;

    const userMsg: AIMessage = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    requestAnimationFrame(() => scrollToBottom(false));
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { reply, threadId: returnedThreadId } = await chatWithThread({
        prompt: userMsg.content,
        threadId,
      }).unwrap();

      if (!threadId && returnedThreadId) setThreadId(returnedThreadId);

      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'assistant', content: reply }]);
      setFiles([]);
    } catch {
      setError('Something went wrong');
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: '⚠️ Something went wrong, please try again.' },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [canSend, input, chatWithThread, threadId]);

  const onDelete = async (id: string) => {
    await deleteThread(id).unwrap();
  };

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const fl = Array.from(e.target.files ?? []);
    if (!fl.length) return;
    setFiles((prev) => [...prev, ...fl].slice(0, 4)); // cap 4 files for UX
    e.currentTarget.value = '';
  }

  function removeFile(name: string) {
    setFiles((prev) => prev.filter((f) => f.name !== name));
  }

  const canPrev = offset > 0;
  const canNext = threads?.hasMore;
  const onPrev = () => canPrev && setOffset(Math.max(0, offset - limit));
  const onNext = () => canNext && setOffset((offset ?? 0) + limit);

  const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '');

  return (
    <div className="flex h-full w-full bg-transparent/30">
      <Card className="mx-auto flex flex-1 ml-2 w-full max-auto flex-col border-none rounded-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          {isMobile && <SidebarTrigger className="-ml-1" />}
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-lg">KodoTask Copilot</CardTitle>
          </div>
          {threadId && <div className="text-xs text-muted-foreground">thread: {shortId(threadId)}</div>}
        </CardHeader>
        <Separator />

        <CardContent className="flex h-full min-h-0 flex-1 flex-col p-0">
          <ScrollArea className="flex-1 px-4" ref={scrollRootRef}>
            <div className="mx-auto flex h-[80vh] w-full max-w-3xl flex-col gap-3 py-4">
              {messages.length === 0 && (
                <div className="mx-auto rounded-xl border p-4 text-sm text-muted-foreground">
                  Type a message — e.g., <em>&quot;Summarize this week&apos;s updates for Project Alpha&quot;</em>
                </div>
              )}

              {messages.map((m) => (
                <Bubble key={m.id} role={m.role} content={m.content} />
              ))}

              {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
              {loading && <TypingBubble />}

              {error && <div className="mx-auto w-full max-w-2xl text-center text-xs text-red-500">{error}</div>}
            </div>
          </ScrollArea>

          <div className="border-t p-3 bg-transparent/20">
            {!!files.length && (
              <div className="mb-2 flex flex-wrap gap-2">
                {files.map((f) => (
                  <div key={f.name} className="group flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                    <span className="max-w-[180px] truncate" title={f.name}>
                      {f.name}
                    </span>
                    {/* eslint-disable-next-line react/button-has-type */}
                    <button
                      className="opacity-60 transition-opacity hover:opacity-100"
                      onClick={() => removeFile(f.name)}
                      aria-label={`remove ${f.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label
                className={cn(
                  'inline-flex cursor-pointer items-center justify-center rounded-md border px-2 py-2',
                  files.length >= 4 && 'pointer-events-none opacity-50',
                )}
                title={files.length >= 4 ? 'Max. 4 files' : 'Pin file'}
              >
                <input type="file" multiple className="hidden" onChange={onFileChange} />
                <Paperclip className="h-5 w-5" />
              </label>

              <div className="relative min-w-0 flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter message ... ( Shift+Enter — new line )"
                  rows={1}
                  className="block w-full resize-none rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                />
              </div>

              <Button className="border-none" size="icon" onClick={sendMessage} disabled={!canSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <RightSidebar className="ml-2">
        <Card className="mx-auto ml-2 rounded-none border-none bg-transparent">
          <CardHeader className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Threads</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={async () => {
                    const t = await createThread().unwrap();
                    setThreadId(t.threadId);
                  }}
                  disabled={creating}
                >
                  New thread
                </Button>
                <Button variant="outline" size="icon" onClick={() => refetch()} disabled={isFetching}>
                  {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOffset(0);
                }}
                placeholder="Search threads…"
                className="pl-8"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 px-4">
            {/* eslint-disable-next-line no-nested-ternary */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-muted/40" />
                ))}
              </div>
            ) : !threads || threads.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <MessageSquare className="mb-2 h-5 w-5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">No threads yet</div>
              </div>
            ) : (
              <div className="divide-y">
                {threads.items.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-start justify-between gap-4 py-3 cursor-pointer hover:bg-muted/30 px-2 cut cut-right-5 cut-left-5"
                    onClick={() => setThreadId(t.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setThreadId(t.id)}
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{t.title || 'Untitled thread'}</div>
                      {t.summary && <div className="truncate text-xs text-muted-foreground">{t.summary}</div>}
                      <div className="mt-1 text-xs text-muted-foreground">Updated: {fmtDate(t.updated_at)}</div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Button
                        className="bg-transparent"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(t.id);
                        }}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">{threads ? `Total: ${threads.total}` : ''}</div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onPrev} disabled={!canPrev}>
                  Prev
                </Button>
                <Button variant="outline" size="sm" onClick={onNext} disabled={!canNext}>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </RightSidebar>
    </div>
  );
}

function Dot({ className = '' }: { className?: string }) {
  return <span className={cn('inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/70', className)} />;
}

function TypingBubble() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Dot />
          <Dot className="animation-delay-150" />
          <Dot className="animation-delay-300" />
        </span>
        Thinking…
      </div>
    </div>
  );
}
