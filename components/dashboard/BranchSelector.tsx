"use client";

import { useEffect, useState } from "react";

interface BranchSelectorProps {
  branches: string[];
  value: string;
  onChange: (branch: string) => void;
  onOpen: () => void;
  isLoading: boolean;
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`h-3.5 w-3.5 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function BranchSelector({ branches, value, onChange, onOpen, isLoading }: BranchSelectorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return; // N'écoute que quand c'est ouvert
  
    function handleClickOutside(e: MouseEvent) {
      setOpen(false);
    }
  
    // Timeout pour laisser le click courant se terminer d'abord
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 0);
  
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-3 font-mono text-sm text-[var(--muted-dark)]">
      <label className="uppercase">BRANCH:</label>
      <div className="relative min-w-[140px]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (!open) onOpen(); // On appelle la fonction de fetch ici
            setOpen((prev) => !prev);
          }}
          className="flex w-full items-center justify-between rounded border border-white/20 bg-transparent px-3 py-1.5 text-[var(--foreground)] transition-colors hover:border-[var(--violet-light)]"
        >
          <span className="truncate mr-2">{isLoading ? "..." : value}</span>
          <ChevronDown open={open} />
        </button>

        {open && (
          <ul role="listbox" className="absolute left-0 right-0 top-[calc(100%+4px)] z-[99] flex flex-col overflow-hidden rounded border border-[var(--violet)] bg-[#0a0a0a] shadow-lg max-h-48 overflow-y-auto">
            {isLoading ? (
              <li className="px-3 py-2 text-xs text-[var(--muted-dark)] animate-pulse font-mono">Chargement des branches...</li>
            ) : (
              branches.map((branch) => (
                <li key={branch}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2.5 text-left font-mono text-[11px] border-b border-white/5 last:border-0 transition-colors hover:bg-[var(--violet)]/20 ${value === branch ? "text-[var(--violet-light)]" : "text-white"}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(branch);
                      setOpen(false);
                    }}
                  >
                    {branch}
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}