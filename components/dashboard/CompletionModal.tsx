"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface CompletionModalProps {
  open: boolean;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="shrink-0"
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function CompletionModal({ open, onClose }: CompletionModalProps) {
  const router = useRouter();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="max-w-[450px] animate-[popIn_0.3s_ease-out] rounded-lg border border-[var(--success)] bg-[var(--bg-panel)] p-10 text-center shadow-[0_0_30px_rgba(0,255,102,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="modal-title"
          className="mb-4 flex items-center justify-center gap-2 font-mono text-2xl text-[var(--success)]"
        >
          <CheckIcon />
          INDEXATION TERMINÉE
        </div>
        <p className="mb-8 font-sans text-base leading-relaxed text-[var(--muted-dark)]">
          Le moteur GraphRAG a généré l&apos;AST et les vecteurs. L&apos;architecture
          est prête à être auditée.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="rounded border border-transparent bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--muted-dark)] transition-colors hover:border-white/20 hover:bg-white/5 hover:text-[var(--foreground)]"
          >
            Retour au Hub
          </Link>
          <button
            type="button"
            onClick={() => router.push("/audit/facebook-react")}
            className="rounded border border-[var(--violet-light)] bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-[var(--background)] hover:shadow-[0_0_10px_var(--violet-glow)]"
          >
            Ouvrir l&apos;Audit
          </button>
        </div>
      </div>
    </div>
  );
}
