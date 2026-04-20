"use client";

import Link from "next/link";
import type { Repo } from "./types";

interface RepoLineProps {
  repo: Repo;
}

export default function RepoLine({ repo }: RepoLineProps) {
  const href = `/dashboard/ingestion/${repo.id}?branch=${encodeURIComponent(repo.defaultBranch)}&name=${encodeURIComponent(repo.name)}`;

  const [owner, repoSlug] = repo.name.includes("/")
    ? (() => {
        const i = repo.name.indexOf("/");
        return [repo.name.slice(0, i), repo.name.slice(i + 1)] as const;
      })()
    : ["", repo.name];

  return (
    <div className="flex flex-col gap-3 px-4 py-5 transition hover:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          {owner ? (
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-[var(--muted-dark)]">
              {owner}
            </span>
          ) : null}
          <span className="hidden text-[var(--muted-dark)] sm:inline">/</span>
          <span className="truncate text-lg font-bold text-white">{repoSlug}</span>
        </div>
        <p className="mt-1 font-mono text-[0.65rem] text-[var(--muted-dark)]">
          branche <span className="text-[var(--violet-light)]">{repo.defaultBranch}</span>
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded border border-[var(--violet-light)] px-4 py-2 text-center font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition hover:bg-[var(--violet-light)] hover:text-black"
      >
        Lancer l&apos;analyse
      </Link>
    </div>
  );
}
