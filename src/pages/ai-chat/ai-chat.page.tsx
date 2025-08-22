import { Paperclip, Send, Sparkles, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Bubble } from '@/pages/ai-chat/Buuble';
import { useGenerateTextMutation } from '@/services/llm';
import { cn } from '@/utils/utils';

export type AIUserRole = 'user' | 'assistant' | 'system';

interface AIMessage {
  id: string;
  role: AIUserRole;
  content: string;
}

function shortId(id: string) {
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

export default function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId] = useState<string | undefined>(undefined);
  const [files, setFiles] = useState<File[]>([]);
  const [generateText, { isLoading: isGenLoading }] = useGenerateTextMutation();

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading && !isGenLoading, [input, loading, isGenLoading]);

  const sendMessage = useCallback(async () => {
    if (!canSend) return;

    const userMsg: AIMessage = { id: crypto.randomUUID(), role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const data = await generateText({ prompt: userMsg.content }).unwrap();

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: data.generatedText ?? '…' },
      ]);
      setFiles([]);
    } catch (e) {
      setError('Something went wrong');
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: '⚠️ Something went wrong, please try again.' },
      ]);
    } finally {
      setLoading(false);
      textareaRef.current?.focus();
    }
  }, [canSend, input, generateText, setMessages, setInput, setLoading, setError, setFiles, textareaRef]);

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

  return (
    <div className="flex h-full w-full flex-col bg-transparent/30">
      <Card className="mx-auto flex ml-2 w-full max-auto flex-1 flex-col border-none rounded-none bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
          {threadId && <div className="text-xs text-muted-foreground">thread: {shortId(threadId)}</div>}
        </CardHeader>
        <Separator />

        <CardContent className="flex h-full min-h-0 flex-1 flex-col p-0">
          <ScrollArea className="flex-1 px-4">
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
