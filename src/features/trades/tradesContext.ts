import { createContext, useContext } from "react";
import type { Trade } from "./parseTradeHistory";

interface TradesContextValue {
  trades: Trade[];
  setTrades: (trades: Trade[]) => void;
}

export const TradesContext = createContext<TradesContextValue | null>(null);

/** Read (and update) the shared trades from any component under <TradesProvider>. */
export function useTrades(): TradesContextValue {
  const context = useContext(TradesContext);
  if (!context) {
    throw new Error("useTrades must be used inside <TradesProvider>");
  }
  return context;
}