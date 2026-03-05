import type { FooterProps } from "./types";

export default function Footer({ copyright, status }: FooterProps) {
  return (
    <footer className="flex justify-between border-t border-[var(--border-color)] px-8 py-8 font-mono text-sm uppercase text-[#666]">
      <div>{copyright}</div>
      <div>{status}</div>
    </footer>
  );
}
