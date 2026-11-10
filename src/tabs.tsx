import type { ReactNode } from "react";
import { TableIcon } from "./icons";
import TradesPage from "./pages/Trades/TradesPage";

export interface AppTab {
  path: string; // URL segment: "trades" -> /trades
  label: string; // text shown in the sidebar
  icon: ReactNode;
  element: ReactNode; // page rendered in the main view
}

// Single source of truth: the sidebar and the router both read this list.
export const tabs: AppTab[] = [
  { path: "trades", label: "Trades", icon: <TableIcon />, element: <TradesPage /> },
  // later: { path: "charts", label: "Charts", icon: <ChartIcon />, element: <ChartsPage /> },
];

export const defaultTabPath = tabs[0]!.path;