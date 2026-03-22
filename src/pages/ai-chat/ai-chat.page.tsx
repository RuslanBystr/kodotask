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
import { SidebarTrigger } from '@/components/ui/sidebar';
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

function Dot({ className = '' }: { className?: string }) {
  return <span className={cn('inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/70', className)} />;
}

function TypingBubble() {
  return (
    <div className="flex w-full justify-start">
      <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-muted-foreground">
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

export default function AIChat() {
  const { threadId: paramId } = useParams();
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

  useEffect(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, window.innerHeight * 0.3)}px`;
  }, [input]);

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
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (!isMobile) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
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
    <div className="h-[100svh] p-2 bg-transparent/10">
      <div
        className="
          mx-auto grid h-full max-w-screen-2xl
          grid-cols-1
          md:grid-cols-[minmax(0,1fr)_360px]
          overflow-x-clip md:overflow-hidden
        "
      >
        <Card className="col-span-1 flex min-w-0 min-h-0 w-full flex-col rounded-none border-none bg-transparent">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <SidebarTrigger className="-ml-1" />
              </div>
              <Sparkles className="h-5 w-5" />
              <CardTitle className="text-base sm:text-lg">KodoPilot</CardTitle>
            </div>
            {threadId && (
              <div className="text-[10px] sm:text-xs text-muted-foreground">thread: {shortId(threadId)}</div>
            )}
          </CardHeader>

          <Separator />

          <CardContent className="flex w-full min-w-0 h-full min-h-0 flex-1 flex-col p-0">
            <ScrollArea className="min-h-0 min-w-0 w-[100%] flex-1 px-3" ref={scrollRootRef}>
              <div className="mx-auto w-full min-w-0 max-w-none flex flex-col gap-3 py-3 sm:py-4">
                {messages.length === 0 && (
                  <div className="flex min-h-[60dvh] items-center justify-center">
                    <div className="mx-auto w-full max-w-sm sm:max-w-md rounded-sm border border-dashed bg-muted/10 p-6 text-center text-sm sm:text-base text-muted-foreground">
                      <h3 className="mb-2 font-medium text-foreground">Welcome to KodoPilot ✨</h3>
                      <p>Start a conversation to get insights, summaries, or help with your projects.</p>
                      <p className="mt-2 text-xs sm:text-sm">
                        Try asking: <em>“Summarize this week&apos;s updates for Project Alpha”</em>
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <Bubble key={m.id} role={m.role} content={m.content} />
                ))}

                {loading && <TypingBubble />}

                {error && <div className="mx-auto w-full text-center text-xs text-red-500">{error}</div>}
              </div>
            </ScrollArea>

            <div className="sticky bottom-0 m-2 bg-muted/50 border-t p-2 sm:p-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] backdrop-blur supports-[backdrop-filter]:backdrop-blur-md">
              {!!files.length && (
                <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
                  {files.map((f) => (
                    <div
                      key={f.name}
                      className="group flex shrink-0 items-center gap-2 rounded-full border px-3 py-1 text-xs"
                    >
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

              <div className="mx-auto mb-2 flex sm:max-w-full md:max-w-full items-end gap-2">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label
                  className={cn(
                    'inline-flex cursor-pointer items-center justify-center border border-gray-700 bg-transparent/10 px-3 py-2 rounded-sm hover:bg-accent-foreground',
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
                    placeholder="Enter message ..."
                    rows={1}
                    className="block w-full resize-none rounded-none text-4 border-b bg-background px-3 py-2 leading-5 shadow-sm outline-none"
                    style={{ maxHeight: '20svh', minHeight: 'auto' }}
                  />
                </div>

                <Button className="border-none bg-transparent rounded-none" onClick={sendMessage} disabled={!canSend}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="hidden md:block min-w-0 overflow-hidden">
          <RightSidebar className="ml-0 h-full min-h-0 min-w-0 overflow-hidden">
            <Card className="h-full rounded-none border-none bg-transparent">
              <CardHeader className="flex flex-col gap-3">
                <div className="flex items-center justify-between min-w-0">
                  <CardTitle className="truncate text-lg">Threads</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      className="bg-transparent rounded-none"
                      variant="default"
                      onClick={async () => {
                        const t = await createThread().unwrap();
                        setThreadId(t.threadId);
                      }}
                      disabled={creating}
                    >
                      New thread
                    </Button>
                    <Button
                      className="bg-transparent rounded-none"
                      variant="default"
                      onClick={() => refetch()}
                      disabled={isFetching}
                    >
                      {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                  <div className="flex flex-col items-center justify-center rounded-sm border border-dashed p-8 text-center">
                    <MessageSquare className="mb-2 h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">No threads yet</div>
                  </div>
                ) : (
                  <div className="divide-y">
                    {threads.items.map((t) => (
                      <div
                        key={t.id}
                        className={cn(
                          'flex items-start justify-between gap-4 py-3 cursor-pointer hover:bg-muted/30 px-2',
                          threadId === t.id ? 'bg-[--main-button-shadow]' : 'bg-transparent/10',
                        )}
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
                            className="bg-transparent rounded-none hover:bg-red-500"
                            variant="destructive"
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
      </div>
    </div>
  );
}
