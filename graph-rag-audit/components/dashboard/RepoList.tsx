"use client";

import { useEffect, useMemo, useState } from "react";
import type { Repo } from "./types";
import RepoLine from "./RepoLine";
import { useDashboardRepoAccess } from "./DashboardAccessContext";
import {
  hasRepoAnalysisCompleted,
  REPO_ANALYSIS_STORAGE_KEY_PREFIX,
} from "../../lib/repo-audit-storage";

interface RepoListProps {
  repos: Repo[];
  accessToken: string;
}

type PageSize = 5 | 10 | 15;
type RepoTab = "public" | "private";
type AnalysisFilter = "all" | "analyzed" | "pending";

function PaginationBar({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) {
    return (
      <div className="flex min-h-[2.25rem] items-center justify-center border-b border-white/10 bg-[#1a1a1e] px-3 py-1.5">
        <p className="font-mono text-[0.65rem] text-[var(--muted)]">
          {totalPages === 0 ? "Aucun dépôt sur cette page" : "Une seule page"}
        </p>
      </div>
    );
  }
  return (
    <div className="flex min-h-[2.35rem] items-center justify-between gap-2 border-b border-[var(--violet)]/20 bg-gradient-to-b from-[#18161c] to-[#141418] px-3 py-1.5">
      <button
        type="button"
        disabled={page <= 1}
        onClick={onPrev}
        className="rounded-md border border-[var(--violet-light)]/45 bg-black/35 px-2.5 py-1 font-mono text-[0.65rem] font-semibold text-white/95 transition hover:border-[var(--violet-light)] hover:bg-[var(--violet)]/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-[var(--muted-dark)] disabled:opacity-35"
      >
        ← Précédent
      </button>
      <span className="shrink-0 rounded-full border border-[var(--violet-light)]/35 bg-[var(--violet)]/12 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold tabular-nums text-[var(--violet-light)]">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        disabled={page >= totalPages}
        onClick={onNext}
        className="rounded-md border border-[var(--violet-light)]/45 bg-black/35 px-2.5 py-1 font-mono text-[0.65rem] font-semibold text-white/95 transition hover:border-[var(--violet-light)] hover:bg-[var(--violet)]/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-transparent disabled:text-[var(--muted-dark)] disabled:opacity-35"
      >
        Suivant →
      </button>
    </div>
  );
}

export default function RepoList({ repos, accessToken }: RepoListProps) {
  const hasRepoScope = useDashboardRepoAccess();

  const scopedRepos = useMemo(
    () => (hasRepoScope ? repos : repos.filter((r) => r.visibility === "public")),
    [repos, hasRepoScope]
  );

  const privateOmittedCount = useMemo(
    () => (!hasRepoScope ? repos.filter((r) => r.visibility === "private").length : 0),
    [repos, hasRepoScope]
  );

  const [search, setSearch] = useState("");
  const [analysisFilter, setAnalysisFilter] = useState<AnalysisFilter>("all");
  const [analysisTick, setAnalysisTick] = useState(0);
  const [activeTab, setActiveTab] = useState<RepoTab>("public");
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [publicPage, setPublicPage] = useState(1);
  const [privatePage, setPrivatePage] = useState(1);

  useEffect(() => {
    const bump = () => setAnalysisTick((t) => t + 1);
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith(REPO_ANALYSIS_STORAGE_KEY_PREFIX)) bump();
    };
    window.addEventListener("focus", bump);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("focus", bump);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = scopedRepos;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((r) => r.name.toLowerCase().includes(q));
    }
    if (analysisFilter === "analyzed") {
      list = list.filter((r) => hasRepoAnalysisCompleted(r.id));
    } else if (analysisFilter === "pending") {
      list = list.filter((r) => !hasRepoAnalysisCompleted(r.id));
    }
    return list;
  }, [scopedRepos, search, analysisFilter, analysisTick]);

  const { publicRepos, privateRepos } = useMemo(() => {
    const pub: Repo[] = [];
    const priv: Repo[] = [];
    for (const r of filtered) {
      if (r.visibility === "private") priv.push(r);
      else pub.push(r);
    }
    return { publicRepos: pub, privateRepos: priv };
  }, [filtered]);

  const hasPrivate = privateRepos.length > 0;

  useEffect(() => {
    setPublicPage(1);
    setPrivatePage(1);
  }, [search, pageSize, analysisFilter, filtered]);

  useEffect(() => {
    if (!hasPrivate && activeTab === "private") setActiveTab("public");
  }, [hasPrivate, activeTab]);

  const searchEmpty = Boolean(search.trim() && filtered.length === 0);

  const publicTotalPages =
    publicRepos.length === 0 ? 0 : Math.ceil(publicRepos.length / pageSize);
  const privateTotalPages =
    privateRepos.length === 0 ? 0 : Math.ceil(privateRepos.length / pageSize);

  const safePublicPage =
    publicTotalPages === 0 ? 1 : Math.min(publicPage, publicTotalPages);
  const safePrivatePage =
    privateTotalPages === 0 ? 1 : Math.min(privatePage, privateTotalPages);

  const publicSlice = publicRepos.slice(
    (safePublicPage - 1) * pageSize,
    safePublicPage * pageSize
  );
  const privateSlice = privateRepos.slice(
    (safePrivatePage - 1) * pageSize,
    safePrivatePage * pageSize
  );

  const pageSizeBtn = (n: PageSize) => (
    <button
      key={n}
      type="button"
      onClick={() => setPageSize(n)}
      className={`min-w-[2.25rem] rounded border px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase transition ${
        pageSize === n
          ? "border-[var(--violet-light)] bg-[var(--violet)]/15 text-[var(--violet-light)]"
          : "border-white/15 bg-white/[0.03] text-[var(--muted-dark)] hover:border-white/25 hover:text-white"
      }`}
    >
      {n}
    </button>
  );

  const tabBtn = (tab: RepoTab, label: string, count: number) => {
    const active = activeTab === tab;
    return (
      <button
        key={tab}
        id={`repo-tab-${tab}`}
        type="button"
        role="tab"
        aria-selected={active}
        aria-controls="repo-tab-panel"
        tabIndex={active ? 0 : -1}
        onClick={() => setActiveTab(tab)}
        className={`relative flex min-h-9 items-center gap-2 rounded-t-md border border-b-0 px-4 py-2 font-mono text-[0.7rem] font-bold uppercase tracking-wide transition ${
          active
            ? "z-[1] border-white/15 bg-[#121215] text-[var(--violet-light)] shadow-[0_-2px_12px_rgba(157,78,221,0.12)]"
            : "border-transparent bg-black/25 text-[var(--muted-dark)] hover:bg-white/[0.04] hover:text-[var(--muted)]"
        }`}
      >
        {label}
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[0.6rem] ${
            active ? "bg-[var(--violet)]/20 text-[var(--violet-light)]" : "bg-white/5 text-[var(--muted-dark)]"
          }`}
        >
          {count}
        </span>
      </button>
    );
  };

  if (searchEmpty) {
    return (
      <section className="px-6 pb-10 pt-6 md:px-8">
        <h1 className="mb-6 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Select Target
        </h1>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Rechercher un dépôt GitHub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-white/20 bg-black/40 px-5 py-3 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--violet)]"
          />
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] text-[var(--muted-dark)] hover:text-white"
          >
            EFFACER
          </button>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-black/30 px-4 py-16 text-center backdrop-blur-sm">
          <p className="mb-2 font-mono text-sm text-[var(--muted-dark)] uppercase">
            Aucun résultat pour &quot;{search}&quot;
          </p>
          <button
            type="button"
            onClick={() => setSearch("")}
            className="font-mono text-xs uppercase text-[var(--violet-light)] underline underline-offset-4"
          >
            Réinitialiser la recherche
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 pb-12 pt-6 md:px-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
            Select Target
          </h1>
          <p className="mt-1 font-mono text-[0.65rem] text-[var(--muted-dark)]">
            {hasRepoScope
              ? "Une fenêtre · onglets Public / Privés"
              : "Une fenêtre · dépôts publics uniquement (scope repo requis pour les privés)"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase text-[var(--muted-dark)]">Lignes / page</span>
          {([5, 10, 15] as const).map((n) => pageSizeBtn(n))}
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative min-w-0 flex-1">
          <input
            type="text"
            placeholder="Rechercher un dépôt GitHub..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-white/20 bg-black/40 px-5 py-3 font-mono text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--violet)] focus:shadow-[0_0_12px_rgba(199,125,255,0.08)]"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] text-[var(--muted-dark)] hover:text-white"
            >
              EFFACER
            </button>
          ) : null}
        </div>
        <span className="font-mono text-[0.6rem] uppercase text-[var(--muted-dark)]">
          {filtered.length} dépôt{filtered.length > 1 ? "s" : ""} affiché{filtered.length > 1 ? "s" : ""} ·{" "}
          <span className="text-[var(--info)]">{publicRepos.length} public</span>
          {hasRepoScope && hasPrivate ? (
            <>
              {" "}
              · <span className="text-[var(--muted)]">{privateRepos.length} privé</span>
            </>
          ) : null}
          {privateOmittedCount > 0 ? (
            <span className="ml-2 text-[var(--warning)]/90 normal-case">
              ({privateOmittedCount} privé{privateOmittedCount > 1 ? "s" : ""} non listé
              {privateOmittedCount > 1 ? "s" : ""})
            </span>
          ) : null}
        </span>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[0.65rem] uppercase text-[var(--muted-dark)]">
          Analyse (ce navigateur)
        </span>
        {(
          [
            { id: "all" as const, label: "Tous" },
            { id: "analyzed" as const, label: "Déjà analysés" },
            { id: "pending" as const, label: "Pas encore" },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAnalysisFilter(id)}
            className={`rounded border px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase transition ${
              analysisFilter === id
                ? "border-[var(--violet-light)] bg-[var(--violet)]/15 text-[var(--violet-light)]"
                : "border-white/15 bg-white/[0.03] text-[var(--muted-dark)] hover:border-white/25 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Fenêtre unique type navigateur + onglets */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-white/[0.12] bg-[#121215] shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
        <div
          className="flex h-8 shrink-0 items-center gap-1.5 border-b border-white/10 bg-[#25252c] px-3"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>

        <div
          className="flex shrink-0 items-end gap-0 border-b border-white/10 bg-[#141418] px-2 pt-2"
          role="tablist"
          aria-label="Type de dépôts"
        >
          {tabBtn("public", "Public", publicRepos.length)}
          {hasPrivate ? tabBtn("private", "Privés", privateRepos.length) : null}
        </div>

        {activeTab === "public" ? (
          <PaginationBar
            page={safePublicPage}
            totalPages={publicTotalPages}
            onPrev={() => setPublicPage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPublicPage((p) =>
                publicTotalPages === 0 ? 1 : Math.min(publicTotalPages, p + 1)
              )
            }
          />
        ) : (
          <PaginationBar
            page={safePrivatePage}
            totalPages={privateTotalPages}
            onPrev={() => setPrivatePage((p) => Math.max(1, p - 1))}
            onNext={() =>
              setPrivatePage((p) =>
                privateTotalPages === 0 ? 1 : Math.min(privateTotalPages, p + 1)
              )
            }
          />
        )}

        <div
          id="repo-tab-panel"
          className="repo-browser-scroll max-h-[min(52vh,440px)] min-h-[120px] overflow-y-auto overscroll-contain"
          role="tabpanel"
          aria-labelledby={`repo-tab-${activeTab}`}
        >
          {activeTab === "public" ? (
            publicRepos.length > 0 ? (
              <div className="flex flex-col divide-y divide-white/[0.06]">
                {publicSlice.map((repo) => (
                  <RepoLine key={repo.id} repo={repo} accessToken={accessToken} />
                ))}
              </div>
            ) : (
              <div className="px-4 py-12 text-center">
                <p className="font-mono text-sm text-[var(--muted-dark)]">
                  {search.trim()
                    ? `Aucun dépôt public pour « ${search} ».`
                    : analysisFilter !== "all"
                      ? "Aucun dépôt public ne correspond à ce filtre d&apos;analyse."
                      : "Aucun dépôt public dans cette liste."}
                </p>
              </div>
            )
          ) : privateRepos.length > 0 ? (
            <div className="flex flex-col divide-y divide-white/[0.06]">
              {privateSlice.map((repo) => (
                <RepoLine key={repo.id} repo={repo} accessToken={accessToken} />
              ))}
            </div>
          ) : (
            <div className="px-4 py-12 text-center">
              <p className="font-mono text-sm text-[var(--muted-dark)]">
                {analysisFilter !== "all"
                  ? "Aucun dépôt privé ne correspond à ce filtre d&apos;analyse."
                  : "Aucun dépôt privé dans cette liste (ou connectez-vous avec l&apos;accès privé GitHub)."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
