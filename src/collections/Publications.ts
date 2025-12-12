import type { CollectionConfig } from "payload";

export const Publications: CollectionConfig = {
  slug: "publications",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "doi",
      type: "text",
      required: true,
    },
  ],
};
