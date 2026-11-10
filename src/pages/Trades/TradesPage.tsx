import PageHeader from "../../components/PageHeader/PageHeader";
import EmptyState from "../../components/EmptyState/EmptyState";
import { TableIcon } from "../../icons";

function TradesPage() {
  return (
    <>
      <PageHeader eyebrow='Dashboard' title='Trades' subtitle='All your trades in one place.' />

      <EmptyState
        icon={<TableIcon size={32} />}
        title='No trades yet'
        description='Upload your trade history and every trade will show up here.'
      />
    </>
  );
}

export default TradesPage;
