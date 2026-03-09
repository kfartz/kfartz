import type { Field } from "payload";
import type { SerializedField } from "@/components/insert-form";

/**
 * Strips functions and circular deps from Payload field configs
 * so they can be passed as serializable props to client components.
 */
export function serializeFields(fields: Field[]): SerializedField[] {
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
