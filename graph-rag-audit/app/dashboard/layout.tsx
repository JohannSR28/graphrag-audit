import type { Metadata } from "next";
import AmbientGlowDashboard from "../../components/dashboard/AmbientGlowDashboard";
import Container from "../../components/Container";
import DashboardHeader from "../../components/dashboard/DashboardHeader";

export const metadata: Metadata = {
  title: "GraphRAG Audit | Hub",
  description: "Dépôts publics GitHub — lancer une ingestion et suivre le worker.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AmbientGlowDashboard />
      <div className="min-h-screen bg-[var(--bg-panel)] pb-16 backdrop-blur-xl">
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-panel)]/95 shadow-[0_4px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <div className="mx-auto w-full max-w-[1400px] border-x border-[var(--border-color)]">
            <DashboardHeader />
          </div>
        </div>
        <Container>
          <div className="pt-28 max-md:pt-32">{children}</div>
        </Container>
      </div>
    </>
  );
}
