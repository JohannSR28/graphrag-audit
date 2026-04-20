/** Dépôt affiché dans le hub (phase simplifiée : publics uniquement). */
export interface Repo {
  id: string;
  name: string;
  defaultBranch: string;
}

export interface IngestionStep {
  id: number;
  label: string;
  progress: number;
  status: "pending" | "active" | "done";
}
