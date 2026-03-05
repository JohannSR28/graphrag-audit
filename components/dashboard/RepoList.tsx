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

  return (
    <section className="px-8 py-12">
      <h1 className="mb-8 text-4xl font-bold uppercase leading-none text-white">
        Select Target.
      </h1>
      <input
        type="text"
        placeholder="Rechercher un dépôt GitHub..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-8 w-full rounded border border-white/20 bg-black/50 px-6 py-4 font-mono text-base text-[var(--foreground)] outline-none transition-[border-color,box-shadow] focus:border-white focus:shadow-[0_0_10px_rgba(255,255,255,0.1)]"
      />
      <div className="flex flex-col border-t border-[var(--border-color)]">
        {filtered.map((repo) => (
          <RepoLine key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}
