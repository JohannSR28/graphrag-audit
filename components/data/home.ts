import type {
  HeaderProps,
  HeroProps,
  MarqueeBannerProps,
  HowItWorksProps,
  FAQProps,
  FooterProps,
} from "../types";

export const headerData: HeaderProps = {
  logoText: "GraphRAG_",
  devLink: {
    href: "https://johannsourou.vercel.app",
    label: "[ DEV PAR JOHANN SOUROU ]",
  },
};

export const heroData: HeroProps = {
  outlineText: "Architecture",
  solidText: "Unmasked.",
  description:
    "Ne lisez plus le code. Comprenez-le. Connectez GitHub, sélectionnez une branche, et laissez l'IA cartographier votre dette technique.",
  cta: {
    href: "/dashboard",
    label: "CONNECTER GITHUB",
  },
  stats: {
    label: "Rapports Générés",
    value: "10.4K",
  },
};

export const marqueeData: MarqueeBannerProps = {
  items: [
    { id: "1", text: "→ AUDIT YOUR REPO" },
    { id: "2", text: "→ FIND THE DEBT", variant: "outline" },
    { id: "3", text: "→ AUDIT YOUR REPO" },
    { id: "4", text: "→ FIND THE DEBT", variant: "outline" },
    { id: "5", text: "→ AUDIT YOUR REPO" },
    { id: "6", text: "→ FIND THE DEBT", variant: "outline" },
  ],
};

export const howItWorksData: HowItWorksProps = {
  steps: [
    {
      id: "1",
      number: "01",
      title: "Connect & Select",
      description:
        "Authentifiez-vous sans friction. Choisissez n'importe quel dépôt (public ou privé) et ciblez la branche spécifique à analyser.",
    },
    {
      id: "2",
      number: "02",
      title: "Deep Ingestion",
      description:
        "Notre moteur clone, parse et convertit vos fichiers en Arbres Syntaxiques (AST) et vecteurs spatiaux. L'ingestion est lente car elle est mathématiquement exhaustive.",
    },
    {
      id: "3",
      number: "03",
      title: "Interactive Audit",
      description:
        "Naviguez dans les 9 piliers de votre architecture. Posez des questions complexes à l'IA sur l'impact de vos futures modifications.",
    },
  ],
};

export const faqData: FAQProps = {
  title: "System FAQ_",
  items: [
    {
      id: "1",
      question: "Copiez-vous mon code ?",
      answer:
        "Non. Le code est converti en embeddings (vecteurs mathématiques) indéchiffrables pour un humain.",
    },
    {
      id: "2",
      question: "Est-ce sécurisé ?",
      answer:
        "Oui. Nous utilisons l'API Google. Si cela vous gêne, ne l'utilisez pas. Garantie de destruction totale des données d'un simple clic.",
    },
    {
      id: "3",
      question: "Comment les risques sont-ils détectés ?",
      answer:
        "Nous ne lisons pas le texte. Nous traversons la topologie du graphe pour identifier les dépendances circulaires et la complexité cognitive.",
    },
    {
      id: "4",
      question: "Pourquoi c'est long ?",
      answer:
        "Parce qu'un véritable audit ne se fait pas avec un simple prompt. Nous reconstruisons votre logique d'affaires en base de données.",
    },
  ],
};

export const footerData: FooterProps = {
  copyright: "© 2026 GRAPHRAG AUDIT",
  status: "STATUS: ONLINE",
};
