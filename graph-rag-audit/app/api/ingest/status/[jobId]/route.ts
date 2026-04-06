import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { getServerWorkerUrl } from "../../../../../lib/worker-url";

/**
 * Proxy GET vers le worker FastAPI : /status/{jobId}
 * Le navigateur n’a pas besoin de connaître l’URL du worker (WORKER_URL côté serveur uniquement).
 */
export async function GET(
  _req: Request,
  context: { params: Promise<{ jobId: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const { jobId } = await context.params;

  const workerRes = await fetch(
    `${getServerWorkerUrl()}/status/${encodeURIComponent(jobId)}`,
    { cache: "no-store" }
  );

  let data: unknown = {};
  try {
    data = await workerRes.json();
  } catch {
    data = { error: "Réponse worker invalide." };
  }

  if (!workerRes.ok) {
    const body = data as { detail?: string; error?: string };
    return NextResponse.json(
      body.detail ?? body.error ?? data,
      { status: workerRes.status }
    );
  }

  return NextResponse.json(data);
}
