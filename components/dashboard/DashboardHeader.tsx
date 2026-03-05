"use client";

export default function DashboardHeader() {
  function handleDelete() {
    if (
      window.confirm(
        "ATTENTION : Cette action effacera toutes vos données vectorielles et désactivera votre compte. Continuer ?"
      )
    ) {
      window.alert("Signal de suppression envoyé.");
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-[var(--border-color)] px-8 py-4">
      <div className="font-mono text-2xl font-extrabold tracking-tight">
        GraphRAG<span className="text-[var(--violet)]">_</span>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex gap-6 font-mono text-sm uppercase">
          <button
            type="button"
            onClick={() => window.alert("Changement de langue : EN")}
            className="border-none bg-transparent text-[var(--muted-dark)] transition-colors hover:text-[var(--foreground)]"
          >
            FR / EN
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="border-none bg-transparent text-[var(--muted-dark)] transition-colors hover:text-[var(--danger)]"
          >
            Supprimer le compte
          </button>
          <button
            type="button"
            onClick={() => window.alert("Déconnexion en cours...")}
            className="border-none bg-transparent text-[var(--muted-dark)] transition-colors hover:text-[var(--foreground)]"
          >
            Déconnexion →
          </button>
        </div>
        <div className="flex items-center gap-3 border-l border-[var(--border-color)] pl-8 font-mono text-sm">
          <span>@johann-sourou</span>
          <div
            className="h-8 w-8 shrink-0 rounded-full border border-white/30 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://github.com/identicons/johann.png")',
            }}
            role="img"
            aria-label="Avatar"
          />
        </div>
      </div>
    </header>
  );
}
