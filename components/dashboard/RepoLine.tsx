"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Repo } from "./types";
import BranchSelector from "./BranchSelector";

interface RepoLineProps {
  repo: Repo;
}

function statusLabel(repo: Repo): string {
  if (repo.status === "cached" && repo.lastCommitHash) {
    return `À JOUR (${repo.lastCommitHash})`;
  }
  if (repo.status === "syncing") return "DÉSYNCHRONISÉ";
  return "NOUVEAU";
}

export default function RepoLine({ repo }: RepoLineProps) {
  const [selectedBranch, setSelectedBranch] = useState(repo.defaultBranch);
  const router = useRouter();

  const repoId = repo.id;
  const ingestionHref = `/dashboard/ingestion/${repoId}?branch=${encodeURIComponent(selectedBranch)}`;

  const handleOpenAudit = () => {
    router.push("/audit/facebook-react");
  };

  return (
    <div className="grid grid-cols-[2fr_1fr_auto] items-center gap-8 border-b border-[var(--border-color)] px-4 py-6 transition-all hover:border-l-[3px] hover:border-l-[var(--violet)] hover:bg-white/[0.02] max-md:grid-cols-1 max-md:gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-lg font-bold">{repo.name}</span>
        <span
          className={`rounded border px-2 py-0.5 font-mono text-[0.65rem] ${
            repo.visibility === "public"
              ? "border-[var(--info)]/30 bg-[var(--info)]/5 text-[var(--info)]"
              : "border-[var(--border-color)] text-[var(--muted)]"
          }`}
        >
          {repo.visibility === "public" ? "PUBLIC" : "PRIVATE"}
        </span>
        <span
          className={`font-mono text-[0.65rem] uppercase ${
            repo.status === "cached"
              ? "text-[var(--success)]"
              : repo.status === "syncing"
                ? "text-[var(--warning)]"
                : "text-[#666]"
          }`}
        >
          {statusLabel(repo)}
        </span>
      </div>
      <BranchSelector
        branches={repo.branches}
        value={selectedBranch}
        onChange={setSelectedBranch}
      />
      <div className="flex justify-end gap-4">
        {repo.status === "cached" ? (
          <>
            <Link
              href={ingestionHref}
              className="rounded border border-transparent bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--muted-dark)] transition-colors hover:border-white/20 hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              RE-SCANNER
            </Link>
            <button
              type="button"
              onClick={handleOpenAudit}
              className="rounded border border-[var(--violet-light)] bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-[var(--background)] hover:shadow-[0_0_10px_var(--violet-glow)]"
            >
              VOIR L&apos;AUDIT
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={handleOpenAudit}
              className="rounded border border-transparent bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--muted-dark)] transition-colors hover:border-white/20 hover:bg-white/5 hover:text-[var(--foreground)]"
            >
              VOIR ANCIEN
            </button>
            <Link
              href={ingestionHref}
              className="rounded border border-[var(--violet-light)] bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-[var(--background)] hover:shadow-[0_0_10px_var(--violet-glow)]"
            >
              METTRE À JOUR
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
