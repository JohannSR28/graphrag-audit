/**
 * Déduit du jeton GitHub si le scope `repo` est présent (accès aux dépôts privés).
 * S’appuie sur l’en-tête X-OAuth-Scopes renvoyé par l’API GitHub.
 */
export async function tokenHasRepoScope(accessToken: string): Promise<boolean> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) return false;

  const raw = res.headers.get("x-oauth-scopes") ?? "";
  const scopes = raw
    .split(/,\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  return scopes.includes("repo");
}
