import { useState, type ReactNode } from "react";
import type { Trade } from "./parseTradeHistory";
import { TradesContext } from "./tradesContext";

/** Holds the trades state. It sits above the pages, so the data survives tab switches. */
function TradesProvider({ children }: { children: ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  return (
    <TradesContext.Provider value={{ trades, setTrades }}>
      {children}
    </TradesContext.Provider>
  );
}

export default TradesProvider;