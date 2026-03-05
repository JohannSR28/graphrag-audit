import type { Repo } from "../types";

export const mockRepos: Repo[] = [
  {
    id: "facebook-react",
    name: "facebook/react",
    visibility: "public",
    status: "cached",
    lastCommitHash: "a1b2c",
    branches: ["main", "v18.2.0"],
    defaultBranch: "main",
  },
  {
    id: "johann-sourou-graphrag-audit",
    name: "johann-sourou/GraphRAG-Audit",
    visibility: "private",
    status: "syncing",
    branches: ["master", "dev"],
    defaultBranch: "master",
  },
];
