import type { CollectionConfig } from "payload";
import type { Publication, Refinement } from "@/payload-types";
import { regeneratePage } from "@/utils/regenerate-pages-hook";
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

  hooks: {
    afterRead: [
      // Serialize refinement relation for display
      ({ doc }) => {
        const prevRefs = doc.refinements as Publication["refinements"];
        doc.refinements = (prevRefs ?? [])
          .map(
            (pRef) =>
              (pRef.refinement as Refinement).name ??
              (pRef.refinement as Refinement).id,
          )
          .join(", ");

        return doc;
      },
    ],
    afterChange: [regeneratePage],
  },
};
