export interface HeaderProps {
  logoText: string;
  devLink: {
    href: string;
    label: string;
  };
}

export interface HeroProps {
  outlineText: string;
  solidText: string;
  description: string;
  cta: {
    href: string;
    label: string;
  };
  stats?: {
    label: string;
    value: string;
  };
}

export interface MarqueeBannerProps {
  items: Array<{ text: string; variant?: "default" | "outline"; id: string }>;
}

export interface StepItem {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface HowItWorksProps {
  steps: StepItem[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQProps {
  title: string;
  items: FAQItem[];
}

export interface FooterProps {
  copyright: string;
  status: string;
}
