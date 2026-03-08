"use client";

import { useMemo, useState } from "react";
import type { Repo } from "./types";
import RepoLine from "./RepoLine";

interface RepoListProps {
  repos: Repo[];
  accessToken: string; // Ajout crucial de la prop accessToken
}

export default function RepoList({ repos, accessToken }: RepoListProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return repos;
    const q = search.toLowerCase().trim();
    return repos.filter((r) => r.name.toLowerCase().includes(q));
  }, [repos, search]);

  return (
    <section className="px-8 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-4xl font-bold uppercase leading-none text-white">
          Select Target.
        </h1>
        <span className="font-mono text-xs text-[var(--muted-dark)] uppercase">
          {filtered.length} Dépôt{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Rechercher un dépôt GitHub..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded border border-white/20 bg-black/50 px-6 py-4 font-mono text-base text-[var(--foreground)] outline-none transition-[border-color,box-shadow] focus:border-[var(--violet)] focus:shadow-[0_0_15px_rgba(199,125,255,0.1)]"
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--muted-dark)] hover:text-white font-mono text-xs"
          >
            EFFACER
          </button>
        )}
      </div>

      <div className="flex flex-col border-t border-[var(--border-color)]">
        {filtered.length > 0 ? (
          filtered.map((repo) => (
            <RepoLine 
              key={repo.id} 
              repo={repo} 
              accessToken={accessToken} // On transmet le jeton ici
            />
          ))
        ) : (
          <div className="py-20 text-center border-b border-[var(--border-color)]">
            <p className="font-mono text-[var(--muted-dark)] uppercase text-sm mb-2">
              Aucun résultat pour &quot;{search}&quot;
            </p>
            <button 
              onClick={() => setSearch("")}
              className="text-[var(--violet-light)] font-mono text-xs uppercase underline underline-offset-4"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}
      </div>
    </section>
  );
}