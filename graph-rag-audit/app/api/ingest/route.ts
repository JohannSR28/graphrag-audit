// app/api/ingest/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerWorkerUrl } from "../../../lib/worker-url";

export async function POST(req: Request) {
  // 1. Vérification de la session
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // 2. Récupération des paramètres
  const { repoName, branch } = await req.json();

  if (!repoName || !branch) {
    return NextResponse.json({ error: "repoName et branch sont requis." }, { status: 400 });
  }

  // 3. Appel au worker Python — le token ne transite jamais par le client
  const pythonRes = await fetch(`${getServerWorkerUrl()}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repo_name: repoName,
      branch: branch,
      github_access_token: session.accessToken, // Ajouté ici côté serveur
    }),
  });

  const data = await pythonRes.json();

  if (!pythonRes.ok) {
    return NextResponse.json({ error: data.detail ?? "Erreur Python." }, { status: pythonRes.status });
  }

  return NextResponse.json(data);
}