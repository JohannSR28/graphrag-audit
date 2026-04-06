// app/dashboard/ingestion/[repoId]/page.tsx
import TelemetryTerminal from "../../../../components/dashboard/TelemetryTerminal";

interface PageProps {
  params: Promise<{ repoId: string }>;
  searchParams: Promise<{ branch?: string; name?: string }>;
}

export default async function IngestionPage({ params, searchParams }: PageProps) {
  const { repoId } = await params;
  const { branch: branchParam, name: nameParam } = await searchParams;

  // Formatage du nom : "facebook/react" -> "facebook / react"
  const rawName = nameParam ?? "Dépôt inconnu";
  const [owner, repoName] = rawName.includes("/") ? rawName.split("/") : ["", rawName];

  const branch = branchParam ?? "main";
  const auditId = "req_" + Math.random().toString(36).slice(2, 11);

  return (
    <main className="p-8">
      {/* En-tête de page compréhensible */}
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 font-mono text-sm text-[var(--muted-dark)] uppercase">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[var(--violet)]" />
          Analyse en cours
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-[var(--muted-dark)]">{owner} /</span> {repoName}
        </h1>

        <div className="flex items-center gap-2 font-mono text-xs text-[var(--violet-light)]">
          <svg className="h-3 w-3 fill-current" viewBox="0 0 16 16">
            <path d="M11.75 2.5a.75.75 0 0 1 .75.75V12a.75.75 0 0 1-1.5 0V3.25a.75.75 0 0 1 .75-.75Z" />
            <path d="M1.75 3.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z" />
          </svg>
          {branch}
        </div>
      </div>

      <TelemetryTerminal
        repoId={repoId}
        repoName={rawName}
        branch={branch}
        auditId={auditId}
      />
    </main>
  );
}