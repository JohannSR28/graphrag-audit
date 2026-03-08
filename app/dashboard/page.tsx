import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RepoList from "@/components/dashboard/RepoList";
import PrivateRepoUpgrade from "@/components/dashboard/PrivateRepoUpgrade";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Récupère les dépôts GitHub de l'utilisateur.
 * On précise que le token est une string pour éviter les erreurs de type.
 */
async function getGitHubRepos(token: string) {
  const res = await fetch("https://api.github.com/user/repos?sort=updated&per_page=50", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function DashboardPage() {
  // 1. Récupération de la session
  const session = await getServerSession(authOptions);

  // 2. Sécurité : Si l'utilisateur n'est pas connecté, redirect
  if (!session) {
    redirect("/");
  }

  // 3. Appel à l'API GitHub
  // Plus besoin de @ts-ignore : session.accessToken est reconnu !
  // On s'assure qu'on a bien un token avant d'appeler la fonction
  const reposData = session.accessToken 
    ? await getGitHubRepos(session.accessToken) 
    : [];

  // 4. Transformation des données avec un typage léger
  const formattedRepos = reposData.map((repo: any) => ({
    id: repo.id.toString(),
    name: repo.full_name,
    visibility: repo.private ? "private" : "public",
    status: "new", 
    defaultBranch: repo.default_branch,
    branches: [repo.default_branch], 
  }));

  return (
    <main>
      <PrivateRepoUpgrade />
      <RepoList repos={formattedRepos} 
      accessToken={session.accessToken as string}/>
    </main>
  );
}