import type { HeaderProps } from "./types";

export default function Header({ logoText, devLink }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-[var(--border-color)] px-8 py-6 uppercase">
      <div className="font-mono text-2xl font-extrabold tracking-tight">
        {logoText}
      </div>
      <a
        href={devLink.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[var(--foreground)] no-underline"
      >
        {devLink.label}
      </a>
    </header>
  );
}
