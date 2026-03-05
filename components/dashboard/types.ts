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

export interface TelemetryLog {
  id: string;
  tag: "GIT-FETCH" | "AST-PARSE" | "EMBEDDING" | "NEO-GRAPH" | "SYS-INIT" | "SYS-DONE";
  tagClass: string;
  file: string;
  metric: string;
}

export interface IngestionStep {
  id: number;
  label: string;
  progress: number;
  status: "pending" | "active" | "done";
}
