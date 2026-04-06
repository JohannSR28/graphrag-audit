export type RepoVisibility = "public" | "private";
export type RepoStatus = "cached" | "syncing" | "new";

export interface Repo {
  id: string;
  name: string;
  visibility: RepoVisibility;
  status: RepoStatus;
  lastCommitHash?: string;
  branches: string[];
  defaultBranch: string;
}


export interface IngestionStep {
  id: number;
  label: string;
  progress: number;
  status: "pending" | "active" | "done";
}
