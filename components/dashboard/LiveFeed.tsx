"use client";

import type { TelemetryLog } from "./types";

interface LiveFeedProps {
  lines: TelemetryLog[];
}

const TAG_CLASSES: Record<string, string> = {
  "tag-git": "text-[#f34f29]",
  "tag-ts": "text-[var(--warning)]",
  "tag-vec": "text-[var(--info)]",
  "tag-neo": "text-[var(--violet-light)]",
  "tag-sys": "text-[var(--success)]",
};

export default function LiveFeed({ lines }: LiveFeedProps) {
  return (
    <div className="relative h-[280px] overflow-hidden rounded border border-white/[0.08] bg-[#050505] max-md:h-[200px]">
      <div
        className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-10 bg-gradient-to-b from-[#050505] to-transparent"
        aria-hidden
      />
      <div className="flex h-full flex-col gap-1.5 overflow-y-auto p-6 font-mono text-[0.75rem] text-[var(--muted-dark)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {lines.map((line) => (
          <div
            key={line.id}
            className="flex gap-2 animate-[slideInLog_0.2s_ease-out_forwards]"
          >
            <span
              className={`min-w-[80px] font-bold ${TAG_CLASSES[line.tagClass] ?? ""}`}
            >
              [{line.tag}]
            </span>
            <span className="min-w-0 flex-1 truncate text-[#ccc]">
              {line.file}
            </span>
            <span className="min-w-[90px] text-right text-[#555]">
              {line.metric}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
