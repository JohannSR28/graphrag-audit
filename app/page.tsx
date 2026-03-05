import type { Metadata } from "next";
import AmbientGlow from "@/components/AmbientGlow";
import Container from "@/components/Container";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MarqueeBanner from "@/components/MarqueeBanner";
import {
  faqData,
  footerData,
  headerData,
  heroData,
  howItWorksData,
  marqueeData,
} from "@/components/data/home";

export const metadata: Metadata = {
  title: "GraphRAG Audit | L'analyseur architectural",
  description:
    "Ne lisez plus le code. Comprenez-le. Connectez GitHub, sélectionnez une branche, et laissez l'IA cartographier votre dette technique.",
  openGraph: {
    title: "GraphRAG Audit | L'analyseur architectural",
    description:
      "Ne lisez plus le code. Comprenez-le. Connectez GitHub et laissez l'IA cartographier votre dette technique.",
  },
};

export default function Home() {
  return (
    <>
      <AmbientGlow />
      <Container>
        <Header {...headerData} />
        <main>
          <Hero {...heroData} />
          <MarqueeBanner {...marqueeData} />
          <HowItWorks {...howItWorksData} />
          <FAQ {...faqData} />
        </main>
        <Footer {...footerData} />
      </Container>
    </>
  );
}
