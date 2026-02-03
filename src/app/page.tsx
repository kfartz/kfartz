import config from "@payload-config";
import { Plus } from "lucide-react";
import { getPayload } from "payload";
import { ResizableTable } from "@/components/resizable-table";
import { TableSwitcherDialog } from "@/components/table-switcher-dialog";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { CurrentTableContextProvider } from "@/context";
import type { TTable } from "@/types";
export default async function TablePage() {
  // const [searchQuery, setSearchQuery] = useState("");

  const payload = await getPayload({ config });
  const collections = Object.keys(payload.collections).filter(
    (coll) =>
      ![
        "search",
        "users",
        "payload-kv",
        "payload-locked-documents",
        "payload-preferences",
        "payload-migrations",
      ].includes(coll),
  ) as (keyof typeof payload.collections)[];
  const descriptions = collections.map((col) => {
    const desc = payload.collections[col].config.admin.description?.toString();
    if (desc) return desc;
    else return "";
  });

  if (!collections) {
    throw new Error("No collections found");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4 justify-between">
          <span>
            <span className="text-muted-foreground ">Table: </span>
            <span className="font-medium">{"Table"}</span>
          </span>
          <Button size="icon" title="Add content to table">
            <Plus className="h-4 w-4" />
          </Button>
          <span>
            <Kbd>
              <span className="text-xs">Ctrl + </span>K{" "}
            </Kbd>
            <span> switch tables</span>
          </span>
        </div>
      </header>
      {/* Main content area */}
      <main className="p-6">
        <CurrentTableContextProvider
          defaultValue={{
            name: collections[0],
            desc: descriptions[0],
          }}
        >
          <ResizableTable />
          {/* Dialogs */}
          <TableSwitcherDialog
            tables={collections.map(
              (col, idx): TTable => ({
                name: col,
                desc: descriptions[idx],
              }),
            )}
          />
        </CurrentTableContextProvider>
      </main>
    </div>
  );
}
