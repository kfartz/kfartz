import { notFound } from "next/navigation";
import type { Field } from "payload";
import InsertForm, { type SerializedField } from "@/components/insert-form";
import type { TTableSlug } from "@/types";
import { payload } from "@/utils/table";

// Helper to strip functions and circular deps from Payload config
function serializeFields(fields: Field[]): SerializedField[] {
  return fields
    .filter(
      (field) =>
        !("name" in field) ||
        (field.name !== "createdAt" && field.name !== "updatedAt"),
    )
    .map((field) => {
      // Base object
      const serialized: SerializedField = {
        name: "name" in field ? field.name : "unnamed-field", // Tabs/UI fields might not have names
        type: field.type,
        required: "required" in field ? field.required : false,
        min: "min" in field ? (field.min as number) : undefined,
        max: "max" in field ? (field.max as number) : undefined,
      };

      // Narrowing for Select fields to access 'options'
      if (field.type === "select" && "options" in field) {
        serialized.options = field.options.map((opt) => {
          if (typeof opt === "string") return opt;
          return { label: opt.label as string, value: opt.value };
        });
      }

      // Narrowing for Relationship fields
      if (field.type === "relationship" && "relationTo" in field) {
        // relationTo can be string or string[], for simplicity in this form we handle string
        if (typeof field.relationTo === "string") {
          serialized.relationTo = field.relationTo;
        }
      }

      // Narrowing for Group/Array fields (Recursion)
      if ("fields" in field && Array.isArray(field.fields)) {
        serialized.fields = serializeFields(field.fields as Field[]);
      }

      return serialized;
    });
}

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
