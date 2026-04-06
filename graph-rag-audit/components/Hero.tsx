"use client"; // Indispensable pour utiliser onClick et signIn

import { signIn } from "next-auth/react";
import type { HeroProps } from "./types";

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-6 w-6 shrink-0 fill-current"
      aria-hidden
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}

export default function Hero({
  outlineText,
  solidText,
  description,
  cta,
  stats,
}: HeroProps) {
  return (
    <section className="relative border-b border-[var(--border-color)] px-8 py-32">
      <span
        className="mb-0 block text-[clamp(3rem,6vw,5rem)] font-extrabold leading-[0.9] uppercase"
        style={{
          color: "transparent",
          WebkitTextStroke: "1px var(--foreground)",
        }}
      >
        {outlineText}
      </span>
      <span className="mb-8 block text-[clamp(3rem,6vw,5rem)] font-extrabold leading-[0.9] uppercase text-[var(--foreground)]">
        {solidText}
      </span>
      <p className="mb-12 max-w-[500px] border-l-2 border-[var(--violet)] pl-4 font-mono text-base text-[var(--muted)]">
        {description}
      </p>
      
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="inline-flex items-center justify-center gap-3 border border-[var(--foreground)] bg-[var(--foreground)] px-8 py-4 font-mono text-base font-bold uppercase text-[var(--background)] no-underline transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:border-[var(--violet)] hover:bg-[var(--violet)] hover:text-[var(--foreground)] hover:shadow-[-4px_4px_0px_rgba(255,255,255,0.2)]"
      >
        <GitHubIcon />
        {cta.label}
      </button>

      {stats && (
        <div className="absolute bottom-0 right-8 hidden border border-[var(--border-color)] border-b-0 bg-[var(--background)] p-4 font-mono md:block">
          <span className="mb-2 block text-[0.7rem] uppercase text-[var(--violet)]">
            {stats.label}
          </span>
          <strong className="text-3xl leading-none">{stats.value}</strong>
        </div>
      )}
    </section>
  );
}