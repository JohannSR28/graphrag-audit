import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AnalyzeConfirmClient from "../../../../components/dashboard/AnalyzeConfirmClient";
import { authOptions } from "../../../api/auth/[...nextauth]/route";

interface PageProps {
  params: Promise<{ repoId: string }>;
  searchParams: Promise<{ name?: string; defaultBranch?: string; prior?: string }>;
}

export default async function AnalyzeConfirmPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    redirect("/");
  }

  const { repoId } = await params;
  const sp = await searchParams;
  const name = sp.name?.trim();
  if (!name) {
    redirect("/dashboard");
  }

  const initialDefaultBranch = sp.defaultBranch?.trim() || "main";
  const priorAuditHint = sp.prior === "1";

  return (
    <main className="p-8">
      <AnalyzeConfirmClient
        repoId={repoId}
        repoName={name}
        accessToken={session.accessToken as string}
        initialDefaultBranch={initialDefaultBranch}
        priorAuditHint={priorAuditHint}
      />
    </main>
  );
}
