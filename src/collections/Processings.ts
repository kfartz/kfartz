import type { CollectionConfig } from "payload";
import { Measurements } from "./Measurements";

export const Processings: CollectionConfig = {
  slug: "processings",
  access: {
    read: () => true,
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
      type: "text",
    },
    {
      name: "_diffrn_reflns_av_sigmaI_netI",
      type: "text",
    },
    {
      name: "_diffrn_reflns_theta_min",
      type: "text",
    },
    {
      name: "_diffrn_reflns_theta_max",
      type: "text",
    },
    {
      name: "comment",
      type: "textarea",
      maxLength: 500,
    },
  ],
};
