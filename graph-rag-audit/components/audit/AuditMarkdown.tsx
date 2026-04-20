import ReactMarkdown from "react-markdown";

type Props = {
  children: string;
};

export function AuditMarkdown({ children }: Props) {
  return (
    <div className="audit-md text-[var(--muted)]">
      <ReactMarkdown
        components={{
          h1: ({ children: c }) => (
            <h1 className="mb-4 mt-0 text-2xl font-bold tracking-tight text-[var(--foreground)]">{c}</h1>
          ),
          h2: ({ children: c }) => (
            <h2 className="mb-3 mt-8 border-b border-white/10 pb-2 text-lg font-semibold text-[var(--foreground)] first:mt-0">
              {c}
            </h2>
          ),
          p: ({ children: c }) => <p className="mb-4 leading-relaxed last:mb-0">{c}</p>,
          ul: ({ children: c }) => <ul className="mb-4 list-disc space-y-2 pl-5 last:mb-0">{c}</ul>,
          li: ({ children: c }) => <li className="leading-relaxed">{c}</li>,
          strong: ({ children: c }) => <strong className="font-semibold text-[var(--foreground)]">{c}</strong>,
          code: ({ children: c, className }) => {
            const inline = !className;
            if (inline) {
              return (
                <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-[var(--violet-light)]">
                  {c}
                </code>
              );
            }
            return (
              <code className="block overflow-x-auto rounded border border-white/10 bg-black/50 p-3 font-mono text-sm">
                {c}
              </code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
