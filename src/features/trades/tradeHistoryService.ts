import { parseTradeHistory } from "./parseTradeHistory";

export const tradeHistoryService = {
  /** Reads the file, parses it and (for now) logs the trades. Cancelled orders are skipped. */
  async load(file: File): Promise<void> {
    const text = await file.text();
    const history = parseTradeHistory(text);
    const trades = history.trades.filter((trade) => trade.status !== "cancelled");

    console.log("Trades:", trades);
  },
};