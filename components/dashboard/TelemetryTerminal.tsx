"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { IngestionStep, TelemetryLog } from "./types";
import {
  FAKE_FILES,
  STEP_DURATIONS_MS,
  STEP_LABELS,
  TOTAL_INGESTION_MS,
} from "./data/telemetry";
import CompletionModal from "./CompletionModal";
import LiveFeed from "./LiveFeed";
import TelemetrySteps from "./TelemetrySteps";

interface TelemetryTerminalProps {
  repoName: string;
  branch: string;
  auditId: string;
}

function generateLogId() {
  return `log-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function addLogLineForStep(
  stepNum: number,
  randomFile: string,
  push: (log: TelemetryLog) => void
) {
  if (stepNum === 1) {
    push({
      id: generateLogId(),
      tag: "GIT-FETCH",
      tagClass: "tag-git",
      file: randomFile,
      metric: `Delta +${Math.floor(Math.random() * 50)}B`,
    });
  } else if (stepNum === 2) {
    push({
      id: generateLogId(),
      tag: "AST-PARSE",
      tagClass: "tag-ts",
      file: randomFile,
      metric: `Extracted ${Math.floor(Math.random() * 500) + 50} nodes`,
    });
  } else if (stepNum === 3) {
    push({
      id: generateLogId(),
      tag: "EMBEDDING",
      tagClass: "tag-vec",
      file: randomFile,
      metric: "1536 dims (ada-002)",
    });
  } else if (stepNum === 4) {
    push({
      id: generateLogId(),
      tag: "NEO-GRAPH",
      tagClass: "tag-neo",
      file: "MERGE (a)-[CALLS]->(b)",
      metric: `+${Math.floor(Math.random() * 10) + 1} edges`,
    });
  }
}

interface AbortModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function AbortModal({ open, onCancel, onConfirm }: AbortModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="abort-modal-title"
    >
      <div
        className="max-w-[520px] animate-[popIn_0.25s_ease-out] rounded-lg border border-red-500/50 bg-[var(--bg-panel)] p-8 text-left shadow-[0_0_35px_rgba(248,113,113,0.4)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3 font-mono text-lg font-semibold text-red-400">
          <span aria-hidden>⚠️</span>
          <h2 id="abort-modal-title">Interrompre l&apos;ingestion ?</h2>
        </div>
        <p className="mb-8 font-sans text-sm leading-relaxed text-[var(--muted-dark)]">
          Le calcul de la topologie AST et la vectorisation sont des processus
          lourds. Si vous interrompez maintenant, toute la progression sera
          perdue et les ressources seront purgées. Vous devrez recommencer
          depuis le début.
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-transparent bg-[var(--violet)] px-4 py-2 font-mono text-xs font-bold uppercase text-black transition-colors hover:bg-[var(--violet-light)]"
          >
            Non, continuer l&apos;ingestion
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded border border-red-500/60 bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-red-400 transition-colors hover:bg-red-500 hover:text-black"
          >
            Oui, tout annuler
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TelemetryTerminal({
  repoName,
  branch,
  auditId,
}: TelemetryTerminalProps) {
  const [steps, setSteps] = useState<IngestionStep[]>(() =>
    STEP_LABELS.map((label, i) => ({
      id: i + 1,
      label,
      progress: 0,
      status: "pending" as const,
    }))
  );
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [negotiationStatus, setNegotiationStatus] = useState("Initialisation...");
  const [etaSeconds, setEtaSeconds] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCancel, setShowCancel] = useState(true);
  const [isAbortModalOpen, setIsAbortModalOpen] = useState(false);
  const router = useRouter();
  const cancelledRef = useRef(false);

  const pushLog = useCallback((log: TelemetryLog) => {
    setLogs((prev) => [...prev, log]);
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    let telemetryInterval: ReturnType<typeof setInterval> | null = null;
    let etaInterval: ReturnType<typeof setInterval> | null = null;
    const activeIntervals: ReturnType<typeof setInterval>[] = [];

    function animateStep(
      stepIndex: number,
      durationMs: number,
      onDone: () => void
    ) {
      if (cancelledRef.current) return;

      setSteps((prev) =>
        prev.map((s, i) =>
          i === stepIndex
            ? { ...s, status: "active" as const }
            : s
        )
      );

      telemetryInterval = setInterval(() => {
        if (cancelledRef.current) {
          if (telemetryInterval) clearInterval(telemetryInterval);
          return;
        }
        const randomFile =
          FAKE_FILES[Math.floor(Math.random() * FAKE_FILES.length)];
        addLogLineForStep(stepIndex + 1, randomFile, pushLog);
      }, 150);

      let progress = 0;
      const intervalTime = 50;
      const stepIncrement = 100 / (durationMs / intervalTime);
      const progressInterval = setInterval(() => {
        if (cancelledRef.current) {
          clearInterval(progressInterval);
          if (telemetryInterval) clearInterval(telemetryInterval);
          return;
        }
        progress += stepIncrement;
        if (progress >= 100) {
          clearInterval(progressInterval);
          if (telemetryInterval) {
            clearInterval(telemetryInterval);
            telemetryInterval = null;
          }
          setSteps((prev) =>
            prev.map((s, i) =>
              i === stepIndex
                ? { ...s, progress: 100, status: "done" as const }
                : s
            )
          );
          setTimeout(() => {
            if (!cancelledRef.current) onDone();
          }, 200);
        } else {
          setSteps((prev) =>
            prev.map((s, i) =>
              i === stepIndex ? { ...s, progress: Math.floor(progress) } : s
            )
          );
        }
      }, intervalTime);
      activeIntervals.push(progressInterval);
    }

    function runSequence(stepIndex: number) {
      if (cancelledRef.current) return;
      if (stepIndex >= STEP_DURATIONS_MS.length) {
        pushLog({
          id: generateLogId(),
          tag: "SYS-DONE",
          tagClass: "tag-sys",
          file: "GraphRAG Engine synchronization complete",
          metric: "200 OK",
        });
        setNegotiationStatus("> Indexation terminée.");
        setShowCancel(false);
        setIsComplete(true);
        setModalOpen(true);
        return;
      }
      const duration = STEP_DURATIONS_MS[stepIndex];
      animateStep(stepIndex, duration, () => runSequence(stepIndex + 1));
    }

    const t = setTimeout(() => {
      if (cancelledRef.current) return;
      setNegotiationStatus("> Connecté au Broker Celery...");
      pushLog({
        id: generateLogId(),
        tag: "SYS-INIT",
        tagClass: "tag-sys",
        file: "Establishing Redis connection",
        metric: "OK",
      });
    }, 400);

    const t2 = setTimeout(() => {
      if (cancelledRef.current) return;
      setNegotiationStatus(`> Verrouillage de la branche ${branch}`);
      const remainingMs = TOTAL_INGESTION_MS;
      let remainingSeconds = Math.ceil(remainingMs / 1000);
      setEtaSeconds(remainingSeconds);
      etaInterval = setInterval(() => {
        if (cancelledRef.current) {
          if (etaInterval) clearInterval(etaInterval);
          return;
        }
        remainingSeconds--;
        setEtaSeconds((prev) => (prev != null ? Math.max(0, prev - 1) : 0));
        if (remainingSeconds <= 0 && etaInterval) {
          clearInterval(etaInterval);
          etaInterval = null;
        }
      }, 1000);
      runSequence(0);
    }, 1000);

    return () => {
      cancelledRef.current = true;
      clearTimeout(t);
      clearTimeout(t2);
      activeIntervals.forEach(clearInterval);
      if (telemetryInterval) clearInterval(telemetryInterval);
      if (etaInterval) clearInterval(etaInterval);
    };
  }, [branch, pushLog]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    router.push("/dashboard");
  }, [router]);

  return (
    <>
      <div className="mx-auto max-w-[1100px] px-8 py-16">
        <div className="relative rounded border border-[var(--border-color)] bg-black p-8">
          <div className="absolute left-4 top-[-12px] bg-[var(--background)] px-4 font-mono text-sm font-bold text-[var(--foreground)]">
            TÉLÉMÉTRIE MOTEUR_
          </div>

          <div className="mb-8 flex items-end justify-between border-b border-[var(--border-color)] pb-4 font-mono">
            <div className="text-lg">
              CIBLE: <span className="text-[var(--foreground)]">{repoName} [{branch}]</span>
              <span className="mt-1 block text-sm text-[#666]">
                AUDIT_ID: {auditId}
              </span>
            </div>
            <div className="text-sm text-[var(--muted-dark)]">
              {negotiationStatus}
            </div>
          </div>

          <div className="mt-4 grid gap-12 max-md:grid-cols-1 md:grid-cols-[1fr_1.2fr]">
            <div>
              <TelemetrySteps steps={steps} />
              <div className="-mt-2 text-right font-mono text-[0.85rem] text-[var(--muted-dark)] pr-11">
                Temps restant:{" "}
                <span className="font-bold text-[var(--info)]">
                  {etaSeconds != null
                    ? `00:${String(etaSeconds).padStart(2, "0")}s`
                    : "--:--"}
                </span>
              </div>
            </div>
            <LiveFeed lines={logs} />
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-[var(--border-color)] pt-4">
            <div>
              {isComplete && (
                <p className="font-mono text-sm text-[var(--success)]">
                  MOTEUR HYBRIDE PRÊT.
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {isComplete && (
                <>
                  <Link
                    href="/dashboard"
                    className="rounded border border-transparent bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--muted-dark)] transition-colors hover:border-white/20 hover:bg-white/5 hover:text-[var(--foreground)]"
                  >
                    Retour au Hub
                  </Link>
                  <button
                    type="button"
                    onClick={() => router.push("/audit/facebook-react")}
                    className="rounded border border-[var(--violet-light)] bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--violet-light)] transition-all hover:bg-[var(--violet-light)] hover:text-[var(--background)]"
                  >
                    Ouvrir l&apos;Audit
                  </button>
                </>
              )}
              {showCancel && (
                <button
                  type="button"
                  onClick={() => setIsAbortModalOpen(true)}
                  className="rounded border border-[var(--danger)] bg-transparent px-4 py-2 font-mono text-xs font-bold uppercase text-[var(--danger)] transition-colors hover:bg-[var(--danger)] hover:text-[var(--foreground)]"
                >
                  ✕ Interrompre
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <CompletionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <AbortModal
        open={isAbortModalOpen}
        onCancel={() => setIsAbortModalOpen(false)}
        onConfirm={() => {
          setIsAbortModalOpen(false);
          handleCancel();
        }}
      />
    </>
  );
}
