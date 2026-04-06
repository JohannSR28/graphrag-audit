"use client";

import { signIn, signOut } from "next-auth/react";
import { useDashboardRepoAccess } from "./DashboardAccessContext";

export default function PrivateRepoUpgrade() {
  const hasRepoScope = useDashboardRepoAccess();

  if (hasRepoScope) {
    return (
      <div className="border-t border-[var(--success)]/20 bg-[var(--success)]/[0.06] px-5 py-2.5 md:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-tight text-[var(--success)]">
              Accès privé activé (scope repo)
            </h3>
            <p className="mt-0.5 text-xs leading-snug text-[var(--muted)] md:text-[0.8rem] md:leading-snug">
              Pour retirer ce droit, GitHub impose une nouvelle connexion : déconnectez-vous, puis reconnectez-vous
              avec « GitHub » sur l&apos;accueil.
            </p>
          </div>
          <button
            type="button"
            title="Vous serez déconnecté : reconnectez-vous avec « GitHub » sur l&apos;accueil pour un jeton sans accès aux dépôts privés (comportement OAuth normal)."
            onClick={() => signOut({ callbackUrl: "/" })}
            className="shrink-0 rounded border border-[var(--success)]/40 bg-[var(--success)]/10 px-4 py-2 text-center font-mono text-[0.55rem] font-bold uppercase leading-tight tracking-wide text-[var(--success)] transition hover:border-[var(--success)]/60 hover:bg-[var(--success)]/15 sm:text-[0.6rem]"
          >
            Retirer l&apos;accès aux dépôts privés
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-[var(--violet)]/25 bg-[var(--violet)]/[0.07] px-5 py-2.5 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-mono text-[0.7rem] font-bold uppercase tracking-tight text-[var(--violet-light)]">
            Accès limité (public uniquement)
          </h3>
          <p className="mt-0.5 text-xs leading-snug text-[var(--muted)] md:text-[0.8rem] md:leading-snug">
            Sans scope <span className="text-[var(--foreground)]">repo</span>, seuls les dépôts publics sont listés.
          </p>
        </div>
        <button
          type="button"
          onClick={() => signIn("github-private", { callbackUrl: "/dashboard" })}
          className="shrink-0 cursor-pointer rounded border border-[var(--violet-light)] bg-transparent px-4 py-2 text-center font-mono text-[0.55rem] font-bold uppercase leading-tight tracking-wide text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-black hover:shadow-[0_0_15px_rgba(199,125,255,0.35)] sm:px-5 sm:text-[0.6rem]"
        >
          Autoriser la lecture des dépôts privés
        </button>
      </div>
    </div>
  );
}
