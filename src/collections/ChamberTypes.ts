import type { CollectionConfig } from "payload";
import { regeneratePage } from "@/utils/regenerate-pages-hook";

export const ChamberTypes: CollectionConfig & { slug: "chamber-types" } = {
  slug: "chamber-types",
  admin: {
    description: "Pressure chamber types 💨",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user?.admin,
    delete: ({ req: { user } }) => !!user?.admin,
    update: ({ req: { user } }) => !!user?.admin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
  hooks: {
    afterChange: [regeneratePage],
  },
};
