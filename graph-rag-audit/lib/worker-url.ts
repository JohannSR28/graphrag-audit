/**
 * URL du worker FastAPI — utilisée uniquement côté serveur Next (routes /api/ingest/*).
 * Le navigateur n’appelle plus le worker directement (polling via /api/ingest/status/...).
 */
const DEFAULT = "http://localhost:8000";

export function getServerWorkerUrl(): string {
  if (typeof process !== "undefined" && process.env.WORKER_URL) {
    return process.env.WORKER_URL.replace(/\/$/, "");
  }
  if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_WORKER_URL) {
    return process.env.NEXT_PUBLIC_WORKER_URL.replace(/\/$/, "");
  }
  return DEFAULT;
}
