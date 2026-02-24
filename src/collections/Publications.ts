import type { CollectionConfig } from "payload";
import { Refinements } from "./Refinements";

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
    {
      name: "refinements",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "refinement",
          type: "relationship",
          required: true,
          relationTo: Refinements.slug,
        },
      ],
    },
    {
      name: "name",
      type: "text",
    },
  ],
};
