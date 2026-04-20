"use client";

import { useMemo, useState } from "react";
import type { Repo } from "./types";
import RepoLine from "./RepoLine";

interface RepoListProps {
  repos: Repo[];
}

export default function RepoList({ repos }: RepoListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return repos;
    const q = search.toLowerCase().trim();
    return repos.filter((r) => r.name.toLowerCase().includes(q));
  }, [repos, search]);

  if (repos.length === 0) {
    return (
      <section className="px-6 pb-10 pt-6 md:px-8">
        <h1 className="mb-4 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Dépôts publics
        </h1>
        <p className="font-mono text-sm text-[var(--muted-dark)]">
          Aucun dépôt public trouvé (compte GitHub ou liste vide).
        </p>
      </section>
    );
  }

  return (
    <section className="px-6 pb-12 pt-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
          Dépôts publics
        </h1>
        <p className="mt-1 font-mono text-[0.65rem] text-[var(--muted-dark)]">
          Branche par défaut du dépôt — lancer ouvre directement l&apos;ingestion.
        </p>
      </div>

      <div className="mb-5">
        <input
          type="text"
          placeholder="Filtrer par nom…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl rounded border border-white/20 bg-black/40 px-4 py-2.5 font-mono text-sm text-[var(--foreground)] outline-none focus:border-[var(--violet)]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="font-mono text-sm text-[var(--muted-dark)]">Aucun résultat pour « {search} ».</p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#121215]">
          <div className="max-h-[min(60vh,520px)] divide-y divide-white/[0.06] overflow-y-auto overscroll-contain">
            {filtered.map((repo) => (
              <RepoLine key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
