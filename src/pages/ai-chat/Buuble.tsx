import ReactMarkdown, { Components } from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { AIUserRole } from '@/pages/ai-chat/ai-chat.page';
import { cn } from '@/utils';

const mdComponents: Components = {
  h1: ({ children }) => <h3 className="mt-0 mb-2">{children}</h3>,
  h2: ({ children }) => <h4 className="mt-0 mb-2">{children}</h4>,
  p: ({ children }) => <p className="my-1 leading-6">{children}</p>,
  strong: ({ children }) => <span className="font-semibold">{children}</span>,
  em: ({ children }) => <em className="opacity-90">{children}</em>,
  ul: ({ children }) => <ul className="my-1 list-disc pl-5">{children}</ul>,
  ol: ({ children }) => <ol className="my-1 list-decimal pl-5">{children}</ol>,
  blockquote: ({ children }) => <blockquote className="my-2 border-l-2 pl-3 opacity-90">{children}</blockquote>,
  code: ({
    inline,
    children,
  }: { inline?: boolean; children?: React.ReactNode; className?: string } & React.HTMLAttributes<HTMLElement>) =>
    inline ? (
      <code className="px-1 py-0.5 rounded bg-muted/40">{children}</code>
    ) : (
      <pre className="p-3 rounded bg-muted/40 overflow-x-auto">
        <code>{children}</code>
      </pre>
    ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
};

export function Bubble({ role, content }: { role: AIUserRole; content: string }) {
  const isUser = role === 'user';
  return (
    <div
      className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}
      aria-label={isUser ? 'User message' : 'Assistant message'}
    >
      <div
        className={cn(
          'rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm',
          isUser ? 'max-w-[78%] rounded-tr-none bg-transparent/10 text-[--main-text]' : 'border-none rounded-none',
        )}
      >
        <div className="prose prose-sm prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]} components={mdComponents}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
