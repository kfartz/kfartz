import type { CollectionConfig } from "payload";
import type { Processing, Refinement } from "@/payload-types";
import { measurementWithUncertainty } from "@/utils/utils";
import { Processings } from "./Processings";

const slug = "refinements";

export const Refinements: CollectionConfig & { slug: typeof slug } = {
  slug,
  admin: {
    description: "Refinement information 🧪",
  },
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
      name: "name",
      type: "text",
    },
    {
      name: "processings",
      type: "array",
      required: true,
      minRows: 1,
      fields: [
        {
          name: "processing",
          type: "relationship",
          required: true,
          relationTo: Processings.slug,
        },
      ],
    },
    {
      name: "previous_refinements",
      type: "array",
      fields: [
        {
          name: "refinement",
          type: "relationship",
          required: true,
          relationTo: slug,
        },
      ],
    },
    {
      name: "disorder",
      type: "checkbox",
      required: true,
    },
    {
      name: "solvent_masking",
      type: "checkbox",
      required: true,
    },
    {
      name: "aspherical_atom_model",
      type: "select",
      required: true,
      options: ["IAM", "TAAM", "HAR"],
    },
    { name: "_chemical_formula_sum", type: "text" },
    { name: "_space_group_name_H-M_alt", type: "text" },
    measurementWithUncertainty("_cell_length_a"),
    measurementWithUncertainty("_cell_length_b"),
    measurementWithUncertainty("_cell_length_c"),
    measurementWithUncertainty("_cell_angle_alpha"),
    measurementWithUncertainty("_cell_angle_beta"),
    measurementWithUncertainty("_cell_angle_gamma"),
    measurementWithUncertainty("_cell_volume"),
    { name: "_diffrn_reflns_av_R_equivalents", type: "number" },
    { name: "_diffrn_reflns_Laue_measured_fraction_full", type: "number" },
    { name: "_refine_ls_R_factor_gt", type: "number" },
    { name: "_refine_ls_wR_factor_ref", type: "number" },
    {
      name: "comment",
      type: "textarea",
      maxLength: 500,
    },
    {
      name: "final",
      type: "checkbox",
      defaultValue: false,
    },
  ],
  hooks: {
    afterRead: [
      // Serialize refinement relation for display
      ({ doc }) => {
        const prevRefs =
          doc.previous_refinements as Refinement["previous_refinements"];
        doc.previous_refinements = (prevRefs ?? [])
          .map(
            (pRef) =>
              (pRef.refinement as Refinement).name ??
              (pRef.refinement as Refinement).id,
          )
          .join(", ");

        // Serialize processing relation for display
        const processings = doc.processings as Refinement["processings"];

        doc.processings = processings
          .map(
            (procRel) =>
              (procRel.processing as Processing).name ??
              (procRel.processing as Processing).id,
          )
          .join(", ");

        return doc;
      },
    ],
  },
};
