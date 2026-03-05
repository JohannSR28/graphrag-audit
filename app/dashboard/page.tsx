import RepoList from "@/components/dashboard/RepoList";
import { mockRepos } from "@/components/dashboard/data/repos";

export default function DashboardPage() {
  return <RepoList repos={mockRepos} />;
}
