import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return (
    <div className="mx-auto min-h-screen max-w-[1400px] border-x border-[var(--border-color)]">
      {children}
    </div>
  );
}
