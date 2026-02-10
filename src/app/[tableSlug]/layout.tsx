import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { tableSlugs } from "@/utils/table";
export type ParamsT = {
  tableSlug: string;
};

export async function generateStaticParams(): Promise<ParamsT[]> {
  return tableSlugs.map((col) => ({
    tableSlug: col,
  }));
}

export default async function TableLayout({
  params,
  children,
}: {
  params: Promise<ParamsT>;
  children: React.ReactNode;
}) {
  // const [searchQuery, setSearchQuery] = useState("");
  const { tableSlug } = await params;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex items-center gap-3 px-6 py-4 justify-between">
          <span>
            <span className="text-muted-foreground ">Table: </span>
            <span className="font-medium">{tableSlug}</span>
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
      {children}
    </div>
  );
}
