"use client";

import { useSession, signIn } from "next-auth/react";

export default function PrivateRepoUpgrade() {
  const { data: session } = useSession();


  const isPrivateAccess = session?.providerId === "github-private";

  // Si l'accès privé est déjà actif, on n'affiche rien.
  if (isPrivateAccess) return null;

  return (
    <div className="mx-8 mt-8 flex items-center justify-between rounded border border-[var(--violet)]/30 bg-[var(--violet)]/5 p-6 backdrop-blur-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-mono text-sm font-bold tracking-tight text-[var(--violet-light)] uppercase">
           Accès Limité (Public Uniquement)
        </h3>
        <p className="max-w-[600px] text-sm text-[var(--muted)]">
          Pour auditer vos dépôts personnels ou d&apos;organisation privés, nous avons besoin d&apos;une autorisation supplémentaire de la part de GitHub.
        </p>
      </div>

      <button
        type="button"
        onClick={() => signIn("github-private", { callbackUrl: "/dashboard" })}
        className="cursor-pointer rounded border border-[var(--violet-light)] bg-transparent px-6 py-2.5 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-black hover:shadow-[0_0_15px_rgba(199,125,255,0.4)]"
      >
        Débloquer l&apos;accès privé
      </button>
    </div>
  );
}