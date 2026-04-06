"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Repo } from "./types";
import BranchSelector from "./BranchSelector";
import {
  hasRepoAnalysisCompleted,
  repoAnalysisStorageKey,
} from "../../lib/repo-audit-storage";

interface RepoLineProps {
  repo: Repo;
  accessToken: string;
}

export default function RepoLine({ repo, accessToken }: RepoLineProps) {
  const [selectedBranch, setSelectedBranch] = useState(repo.defaultBranch);
  const [branches, setBranches] = useState<string[]>(repo.branches);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [hasPastAnalysis, setHasPastAnalysis] = useState(false);
  const router = useRouter();

  const refreshPastAnalysis = useCallback(() => {
    setHasPastAnalysis(hasRepoAnalysisCompleted(repo.id));
  }, [repo.id]);

  useEffect(() => {
    refreshPastAnalysis();
    const onFocus = () => refreshPastAnalysis();
    const onStorage = (e: StorageEvent) => {
      if (e.key === repoAnalysisStorageKey(repo.id)) refreshPastAnalysis();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [repo.id, refreshPastAnalysis]);

  const fetchBranches = async () => {
    if (hasFetched || isLoadingBranches) return;
  
    setHasFetched(true);
    setIsLoadingBranches(true);
  
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.name}/branches`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });
  
      console.log("📡 Status GitHub API:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ GitHub API error:", res.status, errorText);
        return;
      }
  
      const data = await res.json();
      console.log("✅ Branches reçues:", data.map((b: any) => b.name));
      setBranches(data.map((b: any) => b.name));
    } catch (error) {
      console.error("💥 Erreur réseau:", error);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const statusLabel = (r: Repo): string => {
    if (r.status === "cached" && r.lastCommitHash) return `À JOUR (${r.lastCommitHash})`;
    if (r.status === "syncing") return "DÉSYNCHRONISÉ";
    return "NOUVEAU";
  };

  const priorParam =
    hasPastAnalysis || repo.status === "cached" ? "&prior=1" : "";
  const analyzeConfirmHref = `/dashboard/analyze/${repo.id}?name=${encodeURIComponent(repo.name)}&defaultBranch=${encodeURIComponent(selectedBranch)}${priorParam}`;

  const [owner, repoSlug] = repo.name.includes("/")
    ? (() => {
        const i = repo.name.indexOf("/");
        return [repo.name.slice(0, i), repo.name.slice(i + 1)] as const;
      })()
    : ["", repo.name];

  return (
    <div className="grid grid-cols-[2fr_1fr_auto] items-center gap-8 border-b border-white/[0.06] px-4 py-6 transition-all hover:border-l-[3px] hover:border-l-[var(--violet)] hover:bg-white/[0.03] max-md:grid-cols-1 max-md:gap-4">
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
          {owner ? (
            <span className="shrink-0 font-mono text-[0.7rem] font-normal uppercase tracking-wider text-[var(--muted-dark)]">
              {owner}
            </span>
          ) : null}
          <span className="hidden text-[var(--muted-dark)]/80 sm:inline">/</span>
          <span className="truncate text-xl font-bold tracking-tight text-white">
            {repoSlug}
          </span>
        </div>
        <span
          className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[0.65rem] ${
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
        branches={branches}
        value={selectedBranch}
        onChange={setSelectedBranch}
        onOpen={fetchBranches}
        isLoading={isLoadingBranches}
      />

      <div className="flex justify-end gap-4">
        <Link
          href={analyzeConfirmHref}
          className={`rounded border px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
            repo.status === "cached"
              ? "border-white/15 text-[var(--muted)] hover:border-white/25 hover:bg-white/5 hover:text-white"
              : "border-[var(--violet-light)] text-[var(--violet-light)] hover:bg-[var(--violet-light)] hover:text-black"
          }`}
        >
          {repo.status === "cached" ? "Relancer l'analyse" : "Lancer l'analyse"}
        </Link>
        <button
          type="button"
          disabled={!hasPastAnalysis}
          onClick={() => hasPastAnalysis && router.push(`/audit/${repo.id}`)}
          title={
            hasPastAnalysis
              ? "Ouvrir le dernier rapport disponible pour ce dépôt"
              : "Aucune analyse terminée pour ce dépôt sur cet appareil"
          }
          className={`rounded border px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
            hasPastAnalysis
              ? "border-[var(--violet-light)] bg-transparent text-[var(--violet-light)] hover:bg-[var(--violet-light)] hover:text-[var(--background)] hover:shadow-[0_0_10px_var(--violet-glow)]"
              : "cursor-not-allowed border-white/10 bg-transparent text-[var(--muted-dark)] opacity-50"
          }`}
        >
          Voir ancienne analyse
        </button>
      </div>
    </div>
  );
}