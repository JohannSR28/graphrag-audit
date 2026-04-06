export const REPO_ANALYSIS_STORAGE_KEY_PREFIX = "graph-rag-audit:has-audit:";

export function repoAnalysisStorageKey(repoId: string): string {
  return `${REPO_ANALYSIS_STORAGE_KEY_PREFIX}${repoId}`;
}

export function markRepoAnalysisCompleted(repoId: string): void {
  try {
    if (typeof window === "undefined" || !repoId) return;
    localStorage.setItem(repoAnalysisStorageKey(repoId), "1");
  } catch {
    /* ignore */
  }
}

export function hasRepoAnalysisCompleted(repoId: string): boolean {
  try {
    if (typeof window === "undefined" || !repoId) return false;
    return localStorage.getItem(repoAnalysisStorageKey(repoId)) === "1";
  } catch {
    return false;
  }
}
