import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import { TableIcon , UploadIcon } from "../../icons";

function TradesPage() {
  return (
    <>
      <PageHeader eyebrow="Dashboard" title="Trades" subtitle="All your trades in one place." />

      <EmptyState
        icon={<TableIcon size={32} />}
        title="No trades yet"
        description="Upload your broker statement and every trade will show up here."
        action={{ label: "Upload file", icon: <UploadIcon /> }}
        hint=".csv · .htm · .html"
      />
    </>
  );
}

export default TradesPage;