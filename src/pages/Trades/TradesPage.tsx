import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import { TableIcon } from "../../icons";
import { useTrades } from "../../features/trades/tradesContext";

function TradesPage() {
  const { trades } = useTrades();

  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Trades" subtitle="All your trades in one place." />

      {trades.length === 0 ? (
        <EmptyState
          icon={<TableIcon size={32} />}
          title="No trades yet"
          description="Upload your trade history and every trade will show up here."
        />
      ) : (
        // temporary placeholder: the trades table replaces this in the next step
        <p>{trades.length} trades loaded</p>
      )}
    </>
  );
}

export default TradesPage;