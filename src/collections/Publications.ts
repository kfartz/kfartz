import type { CollectionConfig } from "payload";

export const Publications: CollectionConfig = {
  slug: "publications",
  admin: {
    description: "Publication data 📄",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
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
