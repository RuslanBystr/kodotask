import { Highlight, Language, themes } from 'prism-react-renderer';
import { useState } from 'react';
import ReactMarkdown, { type Components as MarkdownComponents } from 'react-markdown';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { AIUserRole } from '@/pages/ai-chat/ai-chat.page';
import { cn } from '@/utils';

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1200);
        } catch {
          /* empty */
        }
      }}
      className="absolute right-2 top-2 rounded-md border px-2 py-0.5 text-xs opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/30"
      aria-label="Copy code"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

function parseHighlightMeta(meta?: string): Set<number> {
  if (!meta) return new Set();
  const match = /\{([\d,\-\s]+)}/.exec(meta);
  if (!match) return new Set();
  const set = new Set<number>();
  const toInt = (s: string): number | null => {
    const n = Number.parseInt(s, 10);
    return Number.isNaN(n) ? null : n;
  };
  const parts = match[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // eslint-disable-next-line no-restricted-syntax
  for (const part of parts) {
    const [startStr, endStr] = part.split('-').map((s) => s.trim());
    const start = toInt(startStr);
    const end = endStr !== undefined ? toInt(endStr) : null;
    // eslint-disable-next-line no-continue
    if (start === null) continue;
    const from = Math.max(1, start);
    const to = end === null ? from : Math.max(1, end);
    const lo = Math.min(from, to);
    const hi = Math.max(from, to);
    for (let i = lo; i <= hi; i += 1) set.add(i);
  }
  return set;
}

const alias: Record<string, Language> = {
  ts: 'tsx',
  tsx: 'tsx',
  typescript: 'tsx',
  js: 'jsx',
  jsx: 'jsx',
  javascript: 'jsx',
  sh: 'bash',
  shell: 'bash',
  bash: 'bash',
  yml: 'yaml',
  yaml: 'yaml',
  md: 'markdown',
  markdown: 'markdown',
  docker: 'docker',
  dockerfile: 'docker',
  json: 'json',
  jsonc: 'json',
  json5: 'json',
  graphql: 'graphql',
  sql: 'sql',
  prisma: 'markup',
  diff: 'diff',
  http: 'markup',
  txt: 'markup',
  text: 'markup',
  plaintext: 'markup',
  py: 'python',
  python: 'python',
  java: 'java',
  go: 'go',
  cpp: 'cpp',
  cplusplus: 'cpp',
  csharp: 'csharp',
  cs: 'csharp',
  rb: 'ruby',
  ruby: 'ruby',
  php: 'php',
  swift: 'swift',
  kt: 'kotlin',
  kotlin: 'kotlin',
};

type LiProps = React.ComponentPropsWithoutRef<'li'> & {
  checked?: boolean | null;
};

type MarkdownCodeRenderer = NonNullable<MarkdownComponents['code']>;
type RendererProps<T> = T extends React.ComponentType<infer P> ? P : never;
export type CodeProps = RendererProps<MarkdownCodeRenderer>;

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null;

const getNodeLang = (node: unknown): string | undefined =>
  isObj(node) && typeof node.lang === 'string' ? node.lang : undefined;

const getNodeMeta = (node: unknown): string | undefined => {
  if (!isObj(node)) return undefined;
  const m1 = node.meta;
  if (typeof m1 === 'string') return m1;
  const { data } = node;
  if (isObj(data) && typeof data.meta === 'string') return data.meta;
  return undefined;
};

export function Code(props: CodeProps) {
  const { className, children, node } = props;

  const inlineRaw = String(children ?? '');
  const hasNewline = inlineRaw.includes('\n');
  const hasLanguageClass = /language-([a-z0-9+#-]+)/i.test(className || '');
  const inlineProp =
    typeof props === 'object' && props && 'inline' in props
      ? // eslint-disable-next-line react/destructuring-assignment
        props.inline
      : undefined;

  const isInline = typeof inlineProp === 'boolean' ? inlineProp : !hasNewline && !hasLanguageClass;

  if (isInline) {
    return (
      <code className="inline-block max-w-full align-middle px-1 py-0.5 rounded bg-white/10 break-words whitespace-pre-wrap">
        {inlineRaw}
      </code>
    );
  }

  const raw = String(children ?? '').replace(/\n$/, '');
  const langFromClass = /language-([a-z0-9+#-]+)/i.exec(className || '')?.[1];
  const langId = (langFromClass ?? getNodeLang(node) ?? '').toLowerCase();

  let language = (alias[langId] || langId || 'markup') as Language;
  const SAFE_FALLBACK: Language = 'markup';

  const KNOWN: Language[] = [
    'tsx',
    'jsx',
    'js',
    'ts',
    'bash',
    'yaml',
    'markdown',
    'docker',
    'json',
    'graphql',
    'sql',
    'diff',
    'markup',
  ] as Language[];
  if (!KNOWN.includes(language)) language = SAFE_FALLBACK;

  if (!langId) {
    return (
      <div className="relative">
        <CopyButton text={raw} />
        <pre
          className="p-3 rounded-lg overflow-x-auto text-[13px] leading-[1.5] border border-white/10"
          data-language="markup"
        >
          <code className={cn(className)}>{raw}</code>
        </pre>
      </div>
    );
  }

  const meta = getNodeMeta(node);

  const activeLines = parseHighlightMeta(meta);

  const prismTheme = {
    ...themes.nightOwl,
    plain: {
      ...themes.nightOwl.plain,
      backgroundColor: 'transparent',
    },
  };

  try {
    return (
      <div className="relative w-full max-w-full overflow-hidden rounded-lg border border-white/10">
        <CopyButton text={raw} />
        <Highlight code={raw} language={language} theme={prismTheme}>
          {({ className: cls, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={cn(
                'w-full max-w-full box-border',
                'overflow-x-auto overflow-y-hidden',
                'py-4 px-3 text-[13px] leading-[1.5] whitespace-pre break-normal font-mono',
                cls,
              )}
              style={style as React.CSSProperties}
              data-language={language}
            >
              {tokens.map((line, i) => {
                const lineNumber = i + 1;
                const isActive = activeLines.has(lineNumber);
                const lineProps = getLineProps({ line });

                return (
                  <div
                    key={`line-${lineNumber}`}
                    {...lineProps}
                    className={cn(
                      'px-0 -mx-4 border-l-2',
                      isActive ? 'bg-white/10 border-[--main-button]' : 'border-transparent',
                    )}
                  >
                    <span className="select-none opacity-40 w-8 inline-block text-right mr-3">{lineNumber}</span>
                    {line.map((token, k) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <span key={`token-${lineNumber}-${k}-${token.content}`} {...getTokenProps({ token })} />
                    ))}
                  </div>
                );
              })}
            </pre>
          )}
        </Highlight>
      </div>
    );
  } catch {
    return (
      <div className="relative">
        <CopyButton text={raw} />
        <pre
          className={cn(
            'w-full max-w-full py-4 px-0 rounded-lg',
            'overflow-x-auto overflow-y-hidden',
            'text-[13px] leading-[1.5] border border-white/10',
            'whitespace-pre break-normal',
          )}
          data-language={language}
        >
          <code className={cn(className)}>{raw}</code>
        </pre>
      </div>
    );
  }
}
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code || []),
      ['className'], // keep language-* for styling
    ],
    pre: [...(defaultSchema.attributes?.pre || []), ['className'], ['data-language']],
    table: [...(defaultSchema.attributes?.table || []), ['className']],
    a: [...(defaultSchema.attributes?.a || []), ['className'], ['rel'], ['target']],
    img: [...(defaultSchema.attributes?.img || []), ['className'], ['loading'], ['decoding'], ['alt'], ['src']],
  },
};

const mdComponents: MarkdownComponents = {
  h1: ({ children }) => <h1 className="mt-2 mb-3 text-xl font-semibold">{children}</h1>,
  h2: ({ children }) => <h2 className="mt-2 mb-2 text-lg font-semibold">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-2 mb-2 text-base font-semibold">{children}</h3>,
  p: ({ children }) => <p className="my-2 leading-6 break-words">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="opacity-90">{children}</em>,

  ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pl-0 marker:text-foreground">{children}</ul>,
  ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pl-0 marker:text-foreground">{children}</ol>,
  li: (rawProps) => {
    const { children, className, ...restRaw } = rawProps as LiProps;
    const { checked } = rawProps as LiProps;
    const rest = restRaw as React.LiHTMLAttributes<HTMLLIElement>;

    if (typeof checked === 'boolean') {
      return (
        <li className={cn('flex items-start gap-2', className)} {...rest}>
          <input
            type="checkbox"
            checked={checked}
            readOnly
            className="mt-1.5 h-3.5 w-3.5 accent-[--main-button]"
            aria-checked={checked}
            aria-label={checked ? 'Completed item' : 'Incomplete item'}
          />
          <span className="break-words">{children}</span>
        </li>
      );
    }

    return (
      <li className={cn('break-words', className)} {...rest}>
        {children}
      </li>
    );
  },
  blockquote: ({ children }) => <blockquote className="my-3 border-l-2 pl-3 opacity-90 italic">{children}</blockquote>,
  // eslint-disable-next-line react/jsx-no-useless-fragment
  pre: ({ children }) => <>{children}</>,
  code: (props) => <Code {...props} />,

  table: ({ children }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,

  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 decoration-white/40 hover:decoration-white break-all"
    >
      {children}
    </a>
  ),

  img: ({ src, alt }) => (
    <img
      src={src || ''}
      alt={alt || ''}
      loading="lazy"
      decoding="async"
      className="my-2 max-h-[420px] w-auto rounded-md border border-white/10"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  ),
};
export function Bubble({ role, content }: { role: AIUserRole; content: string }) {
  const isUser = role === 'user';

  return (
    <div
      className={cn('flex w-full min-w-0 overflow-x-hidden', isUser ? 'justify-end' : 'justify-start')}
      aria-label={isUser ? 'User message' : 'Assistant message'}
    >
      <div
        className={cn(
          'rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm selection:bg-white/20',
          'max-w-full min-w-0 overflow-hidden break-words',
          isUser ? 'max-w-[82%] rounded-tr-none bg-transparent/10 text-[--main-text]' : 'rounded-none',
        )}
      >
        <div
          className={cn(
            'prose prose-sm prose-invert max-w-full min-w-0',
            '[&]:overflow-wrap:anywhere [&]:break-words',
            '[&_a]:break-all',
            '[&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:overflow-y-hidden',
            '[&_pre>code]:whitespace-pre',
            '[&:not(pre)>code]:inline-block [&:not(pre)>code]:max-w-full',
            '[&:not(pre)>code]:whitespace-pre-wrap [&:not(pre)>code]:break-words',
            '[&_img]:max-w-full [&_img]:h-auto',
            '[&_table]:w-full [&_table]:table-fixed [&_td]:break-words',
          )}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
            components={mdComponents}
          >
            {content || ''}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
