import type { CollectionConfig } from "payload";
import { Measurements } from "./Measurements";

export const Processings: CollectionConfig = {
  slug: "processings",
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.admin,
    update: ({ req: { user } }) => !!user?.admin,
  },
  fields: [
    {
      name: "author",
      type: "text",
      required: true,
    },
    {
      name: "measurement",
      type: "relationship",
      relationTo: Measurements.slug,
      required: true,
    },
    {
      name: "_diffrn_reflns_av_R_equivalents",
      type: "number",
    },
    {
      name: "_diffrn_reflns_av_sigmaI_netI",
      type: "number",
    },
    {
      name: "_diffrn_reflns_theta_min",
      type: "number",
    },
    {
      name: "_diffrn_reflns_theta_max",
      type: "number",
    },
    {
      name: "comment",
      type: "textarea",
      maxLength: 500,
    },
  ],
};
