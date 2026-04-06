"use client";

import { createContext, useContext, type ReactNode } from "react";

const DashboardRepoAccessContext = createContext<boolean>(false);

export function DashboardAccessProvider({
  hasRepoScope,
  children,
}: {
  hasRepoScope: boolean;
  children: ReactNode;
}) {
  return (
    <DashboardRepoAccessContext.Provider value={hasRepoScope}>
      {children}
    </DashboardRepoAccessContext.Provider>
  );
}

/** True si le jeton GitHub actuel inclut le scope `repo` (liste / clone privés). */
export function useDashboardRepoAccess(): boolean {
  return useContext(DashboardRepoAccessContext);
}
