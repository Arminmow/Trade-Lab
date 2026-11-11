import { parseTradeHistory, type Trade } from "./parseTradeHistory";

export const tradeHistoryService = {
  /** Reads the file, parses it and returns its trades. Cancelled orders are skipped. */
  async load(file: File): Promise<Trade[]> {
    const text = await file.text();
    const history = parseTradeHistory(text);
    return history.trades.filter((trade) => trade.status !== "cancelled");
  },
};