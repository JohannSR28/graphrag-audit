import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RepoList from "../../components/dashboard/RepoList";
import { authOptions } from "../api/auth/[...nextauth]/route";

interface GitHubRepo {
  id: number;
  full_name: string;
  private: boolean;
  default_branch: string;
}

async function getGitHubRepos(token: string): Promise<GitHubRepo[]> {
  const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const reposData = session.accessToken ? await getGitHubRepos(session.accessToken as string) : [];

  /** Phase simplifiée : uniquement les dépôts publics. */
  const formattedRepos = reposData
    .filter((repo) => !repo.private)
    .map((repo) => ({
      id: repo.id.toString(),
      name: repo.full_name,
      defaultBranch: repo.default_branch,
    }));

  return (
    <main>
      <RepoList repos={formattedRepos} />
    </main>
  );
}
