import { createContext, useContext } from "react";

const DWAContext = createContext(null);

export const DWAProvider = DWAContext.Provider;

export function useDWA() {
  const ctx = useContext(DWAContext);
  if (!ctx) throw new Error("useDWA must be used within a DWAProvider");
  return ctx;
}

export default DWAContext;
