import { ResizableTable } from "@/components/resizable-table";
import { SearchInput } from "@/components/search-input";
import type { TTableSlug } from "@/types";
import { payload } from "@/utils/table";
import { PageSize } from "@/utils/vars";
import type { ParamsT } from "./layout";

export default async function TablePage({
  params,
}: {
  params: Promise<ParamsT>;
}) {
  // const [searchQuery, setSearchQuery] = useState("");
  const tableSlug = (await params).tableSlug as TTableSlug;

  const initQuery = await payload.find({
    collection: tableSlug,
    page: 1,
    limit: PageSize,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Main content area */}
      <main className="p-6">
        <SearchInput tableSlug={tableSlug} />
        <ResizableTable
          slug={tableSlug}
          initQuery={{
            records: initQuery.docs,
            isFetched: !initQuery.hasNextPage,
          }}
        />
      </main>
    </div>
  );
}
