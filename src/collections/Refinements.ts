import type { CollectionConfig } from "payload";
import { measurementWithUncertainty } from "@/utiils";

const slug = "refinements";

export const Refinements: CollectionConfig = {
  slug,
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "relationship",
      name: "author",
      relationTo: "users",
    },
    {
      name: "next_refinements",
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
};
