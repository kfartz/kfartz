import type { CollectionConfig } from "payload";

export const ChamberTypes: CollectionConfig & { slug: "chamber-types" } = {
  slug: "chamber-types",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
