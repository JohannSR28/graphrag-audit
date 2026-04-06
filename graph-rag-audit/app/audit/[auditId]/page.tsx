import Link from "next/link";

interface PageProps {
  params: Promise<{ auditId: string }>;
  searchParams: Promise<{
    repo?: string;
    branch?: string;
    nodes?: string;
    edges?: string;
    loc?: string;
  }>;
}

export default async function AuditPage({ params, searchParams }: PageProps) {
  const { auditId } = await params;
  const sp = await searchParams;
  const repo = sp.repo ?? "—";
  const branch = sp.branch ?? "—";
  const nodes = sp.nodes;
  const edges = sp.edges;
  const loc = sp.loc;

  const hasMetrics = nodes != null && edges != null && loc != null;

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-8 flex flex-col gap-2">
        <div className="font-mono text-sm uppercase text-[var(--muted-dark)]">Rapport d&apos;audit</div>
        <h1 className="text-3xl font-bold tracking-tight">
          Session <span className="font-mono text-[var(--violet-light)]">{auditId}</span>
        </h1>
        <p className="text-[var(--muted-dark)]">
          Dépôt : <span className="text-[var(--foreground)]">{repo}</span>
          {" · "}
          branche <span className="font-mono text-[var(--violet-light)]">{branch}</span>
        </p>
      </div>

      <section className="mb-8 rounded border border-white/10 bg-black/40 p-6">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[var(--muted-dark)]">
          Métriques (ingestion)
        </h2>
        {hasMetrics ? (
          <ul className="grid gap-3 font-mono text-sm sm:grid-cols-3">
            <li>
              <span className="text-[var(--muted-dark)]">Fichiers analysés</span>
              <div className="text-xl text-[var(--success)]">{nodes}</div>
            </li>
            <li>
              <span className="text-[var(--muted-dark)]">Lignes (fichiers parsés)</span>
              <div className="text-xl text-[var(--success)]">{loc}</div>
            </li>
            <li>
              <span className="text-[var(--muted-dark)]">Arêtes import</span>
              <div className="text-xl text-[var(--success)]">{edges}</div>
            </li>
          </ul>
        ) : (
          <p className="text-sm text-[var(--muted-dark)]">
            Aucune métrique dans l&apos;URL. Ouvrez cette page depuis le terminal d&apos;ingestion une fois le
            job terminé, ou lancez une nouvelle analyse depuis le dashboard.
          </p>
        )}
      </section>

      <section className="mb-8 rounded border border-dashed border-white/15 p-6 text-sm text-[var(--muted-dark)]">
        <p className="mb-2">
          Les graphes Neo4j, embeddings et rapport LLM seront branchés ici dans les phases suivantes.
        </p>
      </section>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/dashboard"
          className="rounded border border-white/20 px-4 py-2 font-mono text-xs uppercase text-[var(--muted-dark)] transition hover:bg-white/5 hover:text-white"
        >
          ← Hub dépôts
        </Link>
      </div>
    </main>
  );
}
