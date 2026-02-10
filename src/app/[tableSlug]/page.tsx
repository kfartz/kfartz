import { ResizableTable } from "@/components/resizable-table";
import { TableSwitcherDialog } from "@/components/table-switcher-dialog";
import type { TTableSlug } from "@/types";
import { payload, tables } from "@/utils/table";
import type { ParamsT } from "./layout";

export default async function TablePage({
  params,
}: {
  params: Promise<ParamsT>;
}) {
  // const [searchQuery, setSearchQuery] = useState("");
  const tableSlug = (await params).tableSlug as TTableSlug;
  console.log(`TableSlug: ${tableSlug}`);

  const initQuery = await payload.find({ collection: tableSlug });

  return (
    <div className="min-h-screen bg-background">
      {/* Main content area */}
      <main className="p-6">
        <ResizableTable name={tableSlug} query={initQuery} />
        {/* Dialogs */}
        <TableSwitcherDialog tables={tables} currentTable={tables[tableSlug]} />
      </main>
    </div>
  );
}
