"use client";

import { useEffect, useState } from "react";

interface BranchSelectorProps {
  branches: string[];
  value: string;
  onChange: (branch: string) => void;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function BranchSelector({
  branches,
  value,
  onChange,
}: BranchSelectorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside() {
      setOpen(false);
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 font-mono text-sm text-[var(--muted-dark)]">
      <label className="uppercase">BRANCH:</label>
      <div className="relative min-w-[120px]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((prev) => !prev);
          }}
          className="flex w-full items-center justify-between rounded border border-white/20 bg-transparent px-3 py-1.5 text-[var(--foreground)] transition-colors hover:border-[var(--violet-light)] hover:text-[var(--violet-light)]"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label="Sélectionner la branche"
        >
          <span>{value}</span>
          <ChevronDown open={open} />
        </button>
        {open && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 top-[calc(100%+4px)] z-[99] flex flex-col overflow-hidden rounded border border-[var(--violet)] bg-[#0a0a0a] shadow-lg"
          >
            {branches.map((branch) => (
              <li key={branch} role="option" aria-selected={value === branch}>
                <button
                  type="button"
                  className="w-full border-b border-white/5 px-3 py-2.5 text-left text-[var(--foreground)] transition-colors last:border-b-0 hover:bg-[var(--violet)]/15 hover:pl-5 hover:text-[var(--violet-light)]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(branch);
                    setOpen(false);
                  }}
                >
                  {branch}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
