import Link from "next/link";
import { readFile } from "fs/promises";
import path from "path";
import { AuditMarkdown } from "../../components/audit/AuditMarkdown";

export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ repo?: string; branch?: string; nodes?: string; edges?: string; loc?: string }>;
}) {
  const sp = await searchParams;
  const repo = sp.repo ?? "—";
  const branch = sp.branch ?? "—";
  let body = "";
  try {
    body = await readFile(path.join(process.cwd(), "content", "audit.md"), "utf-8");
  } catch {
    body = "# Rapport d'audit\n\n(Fichier `content/audit.md` introuvable.)";
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex flex-col gap-2">
        <div className="font-mono text-sm uppercase text-[var(--muted-dark)]">Rapport d&apos;audit</div>
        <h1 className="text-3xl font-bold tracking-tight">Rapport</h1>
        <p className="text-[var(--muted-dark)]">
          Dépôt : <span className="text-[var(--foreground)]">{repo}</span>
          {" · "}
          branche <span className="font-mono text-[var(--violet-light)]">{branch}</span>
        </p>
      </div>

      {(sp.nodes != null || sp.edges != null || sp.loc != null) && (
        <section className="mb-8 rounded border border-white/10 bg-black/40 p-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--muted-dark)]">
            Métriques (URL)
          </h2>
          <ul className="grid gap-2 font-mono text-sm sm:grid-cols-3">
            <li>
              <span className="text-[var(--muted-dark)]">Fichiers / nœuds</span>
              <div className="text-lg text-[var(--success)]">{sp.nodes ?? "—"}</div>
            </li>
            <li>
              <span className="text-[var(--muted-dark)]">Lignes</span>
              <div className="text-lg text-[var(--success)]">{sp.loc ?? "—"}</div>
            </li>
            <li>
              <span className="text-[var(--muted-dark)]">Arêtes</span>
              <div className="text-lg text-[var(--success)]">{sp.edges ?? "—"}</div>
            </li>
          </ul>
        </section>
      )}

      <section className="mb-8 rounded border border-white/10 bg-black/30 p-6">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-[var(--muted-dark)]">
          Contenu (`content/audit.md`)
        </h2>
        <AuditMarkdown>{body}</AuditMarkdown>
      </section>

      <Link
        href="/dashboard"
        className="inline-block rounded border border-white/20 px-4 py-2 font-mono text-xs uppercase text-[var(--muted-dark)] transition hover:bg-white/5 hover:text-white"
      >
        ← Hub dépôts
      </Link>
    </main>
  );
}
