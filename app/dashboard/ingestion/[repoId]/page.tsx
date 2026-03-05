import TelemetryTerminal from "@/components/dashboard/TelemetryTerminal";
import { mockRepos } from "@/components/dashboard/data/repos";

interface PageProps {
  params: Promise<{ repoId: string }>;
  searchParams: Promise<{ branch?: string }>;
}

function generateAuditId() {
  return "req_" + Math.random().toString(36).slice(2, 11);
}

export default async function IngestionPage({ params, searchParams }: PageProps) {
  const { repoId } = await params;
  const { branch: branchParam } = await searchParams;

  const repo = mockRepos.find((r) => r.id === repoId);
  const repoName = repo?.name ?? repoId.replace(/-/g, "/");
  const branch = branchParam ?? repo?.defaultBranch ?? "main";
  const auditId = generateAuditId();

  return (
    <TelemetryTerminal
      repoName={repoName}
      branch={branch}
      auditId={auditId}
    />
  );
}
