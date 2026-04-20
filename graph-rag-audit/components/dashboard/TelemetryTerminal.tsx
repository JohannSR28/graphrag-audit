"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { IngestJobStats } from "../../lib/ingest-types";

interface TelemetryTerminalProps {
  repoName: string;
  branch: string;
}

type Status = "idle" | "running" | "done" | "error";

interface LogLine {
  id: string;
  text: string;
  type: "info" | "success" | "error" | "warn";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function TelemetryTerminal({ repoName, branch }: TelemetryTerminalProps) {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [jobId, setJobId] = useState<string | null>(null);
  const [resultStats, setResultStats] = useState<IngestJobStats | null>(null);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastStepRef = useRef<string | null>(null);

  const router = useRouter();

  const push = (text: string, type: LogLine["type"] = "info") =>
    setLogs((prev) => [...prev, { id: uid(), text, type }]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const run = async () => {
      setStatus("running");
      push(`> CIBLE     ${repoName}`);
      push(`> BRANCHE   ${branch}`);
      push(`> ────────────────────────────`);
      push(`> Envoi de l'ordre au worker...`);

      try {
        const res = await fetch("/api/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repoName, branch }),
        });

        const data = await res.json();

        if (!res.ok) {
          push(`> ERREUR : ${data.error ?? "Réponse inattendue du serveur."}`, "error");
          setStatus("error");
          return;
        }

        push(`> Job accepté — ID : ${data.job_id}`, "success");
        setJobId(data.job_id);
      } catch {
        push(`> Impossible de joindre le worker Python.`, "error");
        setStatus("error");
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!jobId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/ingest/status/${encodeURIComponent(jobId)}`);
        const data = await res.json();

        if (!res.ok) {
          if (res.status === 401) {
            push(`> Session expirée ou non authentifié. Reconnectez-vous.`, "error");
            setStatus("error");
            clearInterval(pollingRef.current!);
            return;
          }
          const err =
            typeof data.error === "string"
              ? data.error
              : typeof data.detail === "string"
                ? data.detail
                : `Erreur HTTP ${res.status}`;
          push(`> ${err}`, "error");
          return;
        }

        if (data.status === "running") {
          if (data.current_step && data.current_step !== lastStepRef.current) {
            push(`> [${data.current_step.toUpperCase()}] ${data.message}`, "info");
            lastStepRef.current = data.current_step;
          }
        } else if (data.status === "done") {
          push(`> [COMPLETED] Pipeline d'analyse terminé avec succès.`, "success");

          if (data.stats) {
            setResultStats(data.stats as IngestJobStats);
            const s = data.stats as IngestJobStats;
            const files = s.total_files_parsed ?? s.total_nodes;
            const loc = s.total_lines_of_code ?? 0;
            const edges = s.total_edges ?? 0;
            push(
              `> STATS : ${files} fichiers, ${loc} lignes, ${edges} arêtes d'import (échantillon).`,
              "success"
            );
          }

          setStatus("done");
          clearInterval(pollingRef.current!);
        } else if (data.status === "error") {
          push(`> Échec de l'opération : ${data.error}`, "error");
          setStatus("error");
          clearInterval(pollingRef.current!);
        }
      } catch {
        push(`> Perte de connexion avec le worker... tentative de reconnexion.`, "warn");
      }
    }, 2000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [jobId]);

  const statusColor = {
    idle: "text-[var(--muted-dark)]",
    running: "text-[var(--warning)]",
    done: "text-[var(--success)]",
    error: "text-red-400",
  }[status];

  const statusLabel = {
    idle: "EN ATTENTE",
    running: "TRAITEMENT...",
    done: "TERMINÉ",
    error: "ERREUR",
  }[status];

  return (
    <div className="rounded border border-white/10 bg-black/80 font-mono text-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-500/70" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <span className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[var(--muted-dark)]">
          worker — {repoName}
        </span>
        <span className={`text-[10px] font-bold uppercase ${statusColor}`}>
          {status === "running" && (
            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current align-middle" />
          )}
          {statusLabel}
        </span>
      </div>

      <div className="h-72 overflow-y-auto px-4 py-3">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`leading-6 ${
              log.type === "success"
                ? "text-[var(--success)]"
                : log.type === "error"
                  ? "text-red-400"
                  : log.type === "warn"
                    ? "text-[var(--warning)]"
                    : "text-[var(--muted)]"
            }`}
          >
            {log.text}
          </div>
        ))}
        {status === "running" && (
          <span className="animate-pulse text-[var(--violet-light)]">_</span>
        )}
        <div ref={bottomRef} />
      </div>

      {(status === "done" || status === "error") && (
        <div className="flex justify-end gap-3 border-t border-white/10 px-4 py-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded border border-white/20 px-4 py-1.5 text-xs uppercase text-[var(--muted-dark)] transition hover:bg-white/5 hover:text-white"
          >
            Retour au Hub
          </button>
          {status === "done" && (
            <button
              type="button"
              onClick={() => {
                const q = new URLSearchParams({
                  repo: repoName,
                  branch,
                });
                if (resultStats) {
                  q.set("nodes", String(resultStats.total_nodes));
                  q.set("edges", String(resultStats.total_edges));
                  q.set("loc", String(resultStats.total_lines_of_code ?? 0));
                }
                router.push(`/audit?${q.toString()}`);
              }}
              className="rounded border border-[var(--violet-light)] px-4 py-1.5 text-xs uppercase text-[var(--violet-light)] transition hover:bg-[var(--violet-light)] hover:text-black"
            >
              Ouvrir l&apos;audit (MD) →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
