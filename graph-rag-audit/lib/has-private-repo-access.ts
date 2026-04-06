import type { Session } from "next-auth";

/** True si la session a été ouverte via le provider `github-private` (scope `repo`). */
export function hasPrivateRepoAccess(session: Session | null | undefined): boolean {
  return session?.providerId === "github-private";
}
