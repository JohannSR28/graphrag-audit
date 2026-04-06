import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { tokenHasRepoScope } from "../../lib/github-token-scopes";
import AmbientGlowDashboard from "../../components/dashboard/AmbientGlowDashboard";
import Container from "../../components/Container";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import PrivateRepoUpgrade from "../../components/dashboard/PrivateRepoUpgrade";
import { DashboardAccessProvider } from "../../components/dashboard/DashboardAccessContext";

export const metadata: Metadata = {
  title: "GraphRAG Audit | Hub & Ingestion",
  description: "Sélectionnez un dépôt, lancez l'ingestion et consultez la télémétrie du moteur GraphRAG.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const hasRepoScope =
    typeof session?.accessToken === "string"
      ? await tokenHasRepoScope(session.accessToken)
      : false;

  return (
    <>
      <AmbientGlowDashboard />
      <div className="min-h-screen bg-[var(--bg-panel)] pb-16 backdrop-blur-xl">
        <DashboardAccessProvider hasRepoScope={hasRepoScope}>
          <div className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-panel)]/95 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
            <div className="mx-auto w-full max-w-[1400px] border-x border-[var(--border-color)]">
              <DashboardHeader />
              <PrivateRepoUpgrade />
            </div>
          </div>
          <Container>
            <div className="pt-[10.5rem] max-md:pt-[12.5rem]">{children}</div>
          </Container>
        </DashboardAccessProvider>
      </div>
    </>
  );
}
