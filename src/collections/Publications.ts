import type { CollectionConfig } from "payload";

export const Publications: CollectionConfig = {
  slug: "publications",
  access: {
    read: () => true,
    create: () => true,
    delete: ({ req: { user } }) => !!user?.admin,
    update: ({ req: { user } }) => !!user?.admin,
  },
  fields: [
    {
      name: "doi",
      type: "text",
      required: true,
    },
  ],
};
