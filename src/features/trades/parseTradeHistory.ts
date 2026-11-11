/**
 * parseTradeHistory.ts
 * Turns the trade history report exported by the broker (an MT4-style .htm file)
 * into typed objects. No dependencies, works in the browser and in Node.
 *
 *   const history = parseTradeHistory(await file.text());
 */

export type Side = "buy" | "sell";
export type TradeStatus = "closed" | "open" | "cancelled" | "pending";
export type CloseReason = "sl" | "tp" | "so" | "manual";

export interface Trade {
  status: TradeStatus;
  side: Side;
  symbol: string; // upper-cased, e.g. "XAUUSD"
  size: number; // lots
  openTime: Date; // broker server time, stored as UTC (display with timeZone: "UTC")
  openPrice: number;
  stopLoss: number | null;
  takeProfit: number | null;
  closeTime: Date | null; // null for open / pending; cancel time for cancelled
  closePrice: number | null; // current price for open, market price for pending
  closeReason: CloseReason | null;
  commission: number;
  taxes: number;
  swap: number;
  profit: number;
  netProfit: number; // commission + taxes + swap + profit
  durationSec: number | null;
}

export interface BalanceOperation {
  ticket: string;
  time: Date | null;
  type: string; // "balance" | "credit"
  comment: string;
  amount: number;
}

export interface Account {
  id: string | null;
  name: string | null;
  currency: string | null;
  leverage: string | null;
  generatedAt: Date | null;
}

export interface Summary {
  depositWithdrawal: number | null;
  creditFacility: number | null;
  closedPL: number | null;
  floatingPL: number | null;
  margin: number | null;
  balance: number | null;
  equity: number | null;
  freeMargin: number | null;
}

export interface TradeHistory {
  account: Account;
  trades: Trade[]; // closed + open + cancelled + pending, in file order
  balanceOps: BalanceOperation[];
  summary: Summary;
}

type Section = "closed" | "open" | "working" | "summary";
interface Cell {
  text: string;
  attrs: string;
}

const SECTIONS: Record<string, Section> = {
  "Closed Transactions:": "closed",
  "Open Trades:": "open",
  "Working Orders:": "working",
  "Summary:": "summary",
};

const SUMMARY_KEYS: Record<string, keyof Summary> = {
  "Deposit/Withdrawal:": "depositWithdrawal",
  "Credit Facility:": "creditFacility",
  "Closed Trade P/L:": "closedPL",
  "Floating P/L:": "floatingPL",
  "Margin:": "margin",
  "Balance:": "balance",
  "Equity:": "equity",
  "Free Margin:": "freeMargin",
};

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

// ---------- small helpers ----------

const clean = (s: string) =>
  s
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();

const toNum = (s: string): number => {
  const n = parseFloat(s.replace(/\s/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const toNumOrNull = (s: string): number | null => {
  const n = parseFloat(s.replace(/\s/g, ""));
  return Number.isFinite(n) ? n : null;
};

// MT4 uses 0.00 for "not set" on S/L and T/P
const nullIfZero = (n: number) => (n === 0 ? null : n);

const round2 = (n: number) => Math.round(n * 100) / 100;

/** "2026.11.09 09:28:10" -> Date (UTC) */
function parseTime(s: string): Date | null {
  const m = s.match(/^(\d{4})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, sec] = m;
  return new Date(Date.UTC(+y!, +mo! - 1, +d!, +h!, +mi!, +(sec ?? 0)));
}

/** "2026 November 9, 19:00" -> Date (UTC) */
function parseHeaderDate(s: string): Date | null {
  const m = s.match(/(\d{4}) ([A-Za-z]+) (\d{1,2}), (\d{2}):(\d{2})/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2]!.toLowerCase());
  if (month < 0) return null;
  return new Date(Date.UTC(+m[1]!, month, +m[3]!, +m[4]!, +m[5]!));
}

function parseRows(html: string): Cell[][] {
  const rows: Cell[][] = [];
  for (const tr of html.matchAll(/<tr[\s>][\s\S]*?<\/tr>/gi)) {
    const cells: Cell[] = [];
    for (const td of tr[0].matchAll(/<td([^>]*)>([\s\S]*?)<\/td>/gi)) {
      cells.push({ attrs: td[1] ?? "", text: clean(td[2] ?? "") });
    }
    if (cells.length) rows.push(cells);
  }
  return rows;
}

// ---------- main parser ----------

export function parseTradeHistory(html: string): TradeHistory {
  const account: Account = {
    id: null,
    name: null,
    currency: null,
    leverage: null,
    generatedAt: null,
  };
  const summary: Summary = {
    depositWithdrawal: null,
    creditFacility: null,
    closedPL: null,
    floatingPL: null,
    margin: null,
    balance: null,
    equity: null,
    freeMargin: null,
  };
  const trades: Trade[] = [];
  const balanceOps: BalanceOperation[] = [];

  let section: Section | null = null;

  for (const row of parseRows(html)) {
    const first = row[0]!;

    // section title row, e.g. <td colspan=14><b>Open Trades:</b></td>
    if (row.length === 1 && SECTIONS[first.text]) {
      section = SECTIONS[first.text]!;
      continue;
    }

    // header block above the first section
    if (section === null) {
      for (const c of row) {
        const m = c.text.match(/^(Account|Name|Currency|Leverage):\s*(.*)$/);
        if (m) {
          const value = m[2]!.trim() || null;
          if (m[1] === "Account") account.id = value;
          if (m[1] === "Name") account.name = value;
          if (m[1] === "Currency") account.currency = value;
          if (m[1] === "Leverage") account.leverage = value;
        } else if (/^\d{4} [A-Za-z]+ \d{1,2}, \d{2}:\d{2}$/.test(c.text)) {
          account.generatedAt = parseHeaderDate(c.text);
        }
      }
      continue;
    }

    // summary block: label cell followed by its value cell
    if (section === "summary") {
      row.forEach((c, i) => {
        const key = SUMMARY_KEYS[c.text];
        if (!key) return;
        const valueCell = row.slice(i + 1).find((x) => /^-?[\d\s]+(\.\d+)?$/.test(x.text));
        if (valueCell) summary[key] = toNumOrNull(valueCell.text);
      });
      continue;
    }

    // trade rows start with a numeric ticket
    if (!/^\d+$/.test(first.text) || row.length < 4) continue;
    const t = (i: number) => row[i]?.text ?? "";
    const type = t(2).toLowerCase();

    // deposits / withdrawals / credit rows
    if (type === "balance" || type === "credit") {
      balanceOps.push({
        ticket: first.text,
        time: parseTime(t(1)),
        type,
        comment: t(3),
        amount: toNum(row[row.length - 1]!.text),
      });
      continue;
    }

    const [sideWord] = type.split(" ");
    if (sideWord !== "buy" && sideWord !== "sell") continue;

    const cancelled = /cancelled/i.test(first.attrs) || row.some((c) => c.text.toLowerCase() === "cancelled");
    const status: TradeStatus =
      section === "working" ? "pending" : cancelled ? "cancelled" : section === "open" ? "open" : "closed";

    const openTime = parseTime(t(1));
    if (!openTime) continue;

    // working orders: col 8 is "Market Price"; everything else: col 8 is close time, col 9 close price
    const closeTime = status === "pending" ? null : parseTime(t(8));
    const closePrice = status === "pending" ? toNumOrNull(t(8)) : toNumOrNull(t(9));

    const hasMoney = status === "closed" || status === "open";
    const commission = hasMoney ? toNum(t(10)) : 0;
    const taxes = hasMoney ? toNum(t(11)) : 0;
    const swap = hasMoney ? toNum(t(12)) : 0;
    const profit = hasMoney ? toNum(t(13)) : 0;

    const reasonTag = first.attrs.match(/\[(sl|tp|so)\]/i)?.[1]?.toLowerCase() as
      | "sl"
      | "tp"
      | "so"
      | undefined;

    trades.push({
      status,
      side: sideWord,
      symbol: t(4).toUpperCase(),
      size: toNum(t(3)),
      openTime,
      openPrice: toNum(t(5)),
      stopLoss: nullIfZero(toNum(t(6))),
      takeProfit: nullIfZero(toNum(t(7))),
      closeTime,
      closePrice,
      closeReason: reasonTag ?? (status === "closed" ? "manual" : null),
      commission,
      taxes,
      swap,
      profit,
      netProfit: round2(commission + taxes + swap + profit),
      durationSec: closeTime ? Math.round((closeTime.getTime() - openTime.getTime()) / 1000) : null,
    });
  }

  return { account, trades, balanceOps, summary };
}
