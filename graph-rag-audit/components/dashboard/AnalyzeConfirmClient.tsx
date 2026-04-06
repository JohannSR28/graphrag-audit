"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import BranchSelector from "./BranchSelector";
import {
  hasRepoAnalysisCompleted,
  repoAnalysisStorageKey,
} from "../../lib/repo-audit-storage";

interface AnalyzeConfirmClientProps {
  repoId: string;
  repoName: string;
  accessToken: string;
  initialDefaultBranch: string;
  /** Depuis le hub : dépôt déjà marqué « cache » ou analyse locale connue */
  priorAuditHint: boolean;
}

export default function AnalyzeConfirmClient({
  repoId,
  repoName,
  accessToken,
  initialDefaultBranch,
  priorAuditHint,
}: AnalyzeConfirmClientProps) {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState(initialDefaultBranch);
  const [branches, setBranches] = useState<string[]>([initialDefaultBranch]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [overwriteModalOpen, setOverwriteModalOpen] = useState(false);
  const [storedCompleted, setStoredCompleted] = useState(false);

  const refreshStored = useCallback(() => {
    setStoredCompleted(hasRepoAnalysisCompleted(repoId));
  }, [repoId]);

  useEffect(() => {
    refreshStored();
    const onFocus = () => refreshStored();
    const onStorage = (e: StorageEvent) => {
      if (e.key === repoAnalysisStorageKey(repoId)) refreshStored();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, [repoId, refreshStored]);

  const needsOverwriteConfirm = useMemo(
    () => storedCompleted || priorAuditHint,
    [storedCompleted, priorAuditHint]
  );

  const fetchBranches = async () => {
    if (hasFetched || isLoadingBranches) return;
    setHasFetched(true);
    setIsLoadingBranches(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${repoName}/branches`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setBranches(data.map((b: { name: string }) => b.name));
    } catch {
      /* ignore */
    } finally {
      setIsLoadingBranches(false);
    }
  };

  const ingestionHref = `/dashboard/ingestion/${repoId}?branch=${encodeURIComponent(selectedBranch)}&name=${encodeURIComponent(repoName)}`;

  const startIngestion = () => {
    router.push(ingestionHref);
  };

  const onConfirmLaunch = () => {
    if (needsOverwriteConfirm) {
      setOverwriteModalOpen(true);
      return;
    }
    startIngestion();
  };

  const [owner, repoSlug] = repoName.includes("/")
    ? (() => {
        const i = repoName.indexOf("/");
        return [repoName.slice(0, i), repoName.slice(i + 1)] as const;
      })()
    : ["", repoName];

  return (
    <>
      <div className="mb-8 flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="w-fit font-mono text-xs uppercase text-[var(--muted-dark)] transition hover:text-[var(--violet-light)]"
        >
          ← Hub dépôts
        </Link>
        <div className="font-mono text-sm uppercase text-[var(--muted-dark)]">
          Confirmer l&apos;analyse
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          {owner ? (
            <>
              <span className="text-[var(--muted-dark)]">{owner} /</span> {repoSlug}
            </>
          ) : (
            repoSlug
          )}
        </h1>
        <p className="max-w-xl text-sm text-[var(--muted-dark)]">
          Choisissez la branche à ingérer, puis lancez l&apos;analyse. Vous serez redirigé vers le terminal
          de suivi.
        </p>
      </div>

      <div className="max-w-xl rounded-xl border border-white/[0.12] bg-[#121215] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div className="mb-6">
          <BranchSelector
            branches={branches}
            value={selectedBranch}
            onChange={setSelectedBranch}
            onOpen={fetchBranches}
            isLoading={isLoadingBranches}
          />
        </div>

        {needsOverwriteConfirm ? (
          <p className="mb-4 rounded border border-[var(--warning)]/30 bg-[var(--warning)]/5 px-3 py-2 font-mono text-[0.65rem] text-[var(--warning)]">
            Un audit antérieur est connu pour ce dépôt. Une nouvelle analyse peut remplacer le suivi et le
            lien « Voir ancienne analyse » sur cet appareil.
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onConfirmLaunch}
            className="rounded border border-[var(--violet-light)] bg-[var(--violet)]/10 px-5 py-2.5 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition hover:bg-[var(--violet-light)] hover:text-black"
          >
            Lancer l&apos;analyse
          </button>
          {storedCompleted ? (
            <button
              type="button"
              onClick={() => router.push(`/audit/${repoId}`)}
              title="Ouvrir le dernier rapport disponible pour ce dépôt sur cet appareil"
              className="rounded border border-[var(--violet-light)] bg-transparent px-5 py-2.5 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition hover:bg-[var(--violet-light)] hover:text-[var(--background)] hover:shadow-[0_0_10px_var(--violet-glow)]"
            >
              Voir l&apos;ancienne analyse
            </button>
          ) : null}
          <Link
            href="/dashboard"
            className="rounded border border-white/15 px-5 py-2.5 font-mono text-xs font-bold uppercase text-[var(--muted)] transition hover:border-white/25 hover:bg-white/5 hover:text-white"
          >
            Annuler
          </Link>
        </div>
      </div>

      {overwriteModalOpen ? (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/65 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="overwrite-title"
          onClick={() => setOverwriteModalOpen(false)}
        >
          <div
            className="mx-4 max-w-md rounded-xl border border-[var(--warning)]/40 bg-[#141418] p-6 shadow-[0_0_40px_rgba(255,180,0,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="overwrite-title" className="mb-3 font-mono text-lg font-bold text-[var(--warning)]">
              Écraser l&apos;audit précédent ?
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--muted)]">
              Lancer une nouvelle ingestion remplace le contexte de l&apos;audit précédent pour ce dépôt sur
              cet appareil. Le job sur le serveur démarre une nouvelle session : confirmez seulement si vous
              acceptez de poursuivre.
            </p>
            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setOverwriteModalOpen(false)}
                className="rounded border border-white/20 px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--muted)] transition hover:bg-white/5 hover:text-white"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setOverwriteModalOpen(false);
                  startIngestion();
                }}
                className="rounded border border-[var(--violet-light)] bg-[var(--violet)]/15 px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition hover:bg-[var(--violet-light)] hover:text-black"
              >
                Écraser et lancer
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
