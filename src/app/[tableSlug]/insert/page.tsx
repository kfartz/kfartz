import { notFound } from "next/navigation";
import InsertForm from "@/components/insert-form";
import type { TTableSlug } from "@/types";
import { serializeFields } from "@/utils/serialize-fields";
import { payload } from "@/utils/table";

export default async function InsertPage({
  params,
}: {
  params: Promise<{ tableSlug: string }>;
}) {
  const { tableSlug } = await params;

  const collection = payload.collections[tableSlug as TTableSlug];
  if (!collection) {
    return notFound();
  }

  const rawFields = collection.config.fields;
  const clientFields = serializeFields(rawFields);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold capitalize">New {tableSlug}</h1>
          <p className="text-muted-foreground mt-2">
            {collection.config.admin?.description?.toString() ||
              "Create a new entry"}
          </p>
        </header>

        <main className="bg-card p-6 rounded-lg border shadow-sm">
          <InsertForm
            tableSlug={tableSlug as TTableSlug}
            fields={clientFields}
          />
        </main>
      </div>
    </div>
  );
}
