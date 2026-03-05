"use client";

import type { IngestionStep } from "./types";

interface TelemetryStepsProps {
  steps: IngestionStep[];
}

function statusIcon(status: IngestionStep["status"]) {
  if (status === "active") return "[~]";
  if (status === "done") return "[✓]";
  return "[-]";
}

export default function TelemetrySteps({ steps }: TelemetryStepsProps) {
  return (
    <div className="flex flex-col justify-center">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`mb-8 flex items-center justify-between font-mono text-sm ${
            step.status === "active"
              ? "text-[var(--foreground)]"
              : step.status === "done"
                ? "text-[var(--success)]"
                : "text-[#444]"
          }`}
        >
          <div className="flex w-[250px] items-center gap-4">
            <span className="w-5 text-center font-bold">
              {statusIcon(step.status)}
            </span>
            <span>{step.label}</span>
          </div>
          <div className="mx-6 h-0.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--violet-light)] transition-[width] duration-300 ease-linear"
              style={{
                width: `${step.progress}%`,
                backgroundColor:
                  step.status === "done"
                    ? "var(--success)"
                    : "var(--violet-light)",
              }}
            />
          </div>
          <span className="w-11 text-right">{step.progress}%</span>
        </div>
      ))}
    </div>
  );
}
