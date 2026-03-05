import type { Metadata } from "next";
import AmbientGlowDashboard from "@/components/dashboard/AmbientGlowDashboard";
import Container from "@/components/Container";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export const metadata: Metadata = {
  title: "GraphRAG Audit | Hub & Ingestion",
  description: "Sélectionnez un dépôt, lancez l'ingestion et consultez la télémétrie du moteur GraphRAG.",
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
        <Container>
          <DashboardHeader />
          {children}
        </Container>
      </div>
    </>
  );
}
