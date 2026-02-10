import type { CollectionConfig } from "payload";

import { deg2rad, measurementWithUncertainty } from "@/utils/utils";
import { ChamberTypes } from "./ChamberTypes";
import { Crystals } from "./Crystals";

export const Measurements: CollectionConfig & { slug: "measurements" } = {
  slug: "measurements",
  admin: {
    description: "Measurement information 📏",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.admin,
    update: ({ req: { user } }) => !!user?.admin,
  },
  fields: [
    {
      name: "crystal",
      type: "relationship",
      relationTo: Crystals.slug,
      required: true,
    },
    {
      name: "pi_name",
      type: "text",
      required: true,
    },
    {
      name: "grant_id",
      type: "text",
      required: true,
    },
    {
      name: "operator_name",
      type: "text",
      required: true,
    },
    {
      name: "facility_name",
      type: "text",
      required: true,
    },
    {
      name: "measurement_starting_date",
      type: "date",
      required: true,
    },
    {
      name: "experiment_type",
      type: "select",
      required: true,
      options: ["single crystal", "powder", "non-ambient"],
    },
    measurementWithUncertainty("_diffrn_ambient_temperature"),
    {
      name: "_diffrn_radiation_probe",
      type: "text",
    },
    {
      name: "_diffrn_radiation_wavelength",
      type: "number",
      min: 0,
    },
    {
      name: "_diffrn_measurement_device_type",
      type: "text",
    },
    {
      name: "_diffrn_detector_type",
      type: "text",
    },
    {
      name: "_diffrn_reflns_theta_max",
      type: "number",
    },
    {
      name: "resolution",
      type: "number",
      virtual: true,
      hooks: {
        afterRead: [
          ({ siblingData }) =>
            siblingData._diffrn_radiation_wavelength /
            2 /
            Math.sin(deg2rad * siblingData._diffrn_reflns_theta_max),
        ],
      },
    },
    {
      name: "pressure",
      type: "number",
      min: 0,
      // @ts-expect-error this should work, but of course ts says nuh-uh
      validate: (value, { data: { experiment_type } }): true | string =>
        experiment_type === "non-ambient" && !value
          ? "pressure is required for non-ambient experiments"
          : true,
      admin: {
        condition: ({ experiment_type }) => experiment_type === "non-ambient",
      },
    },
    {
      name: "pressure_measurement_location",
      type: "text",
      maxLength: 100,
      // @ts-expect-error
      validate: (value, { data: { experiment_type } }): true | string =>
        experiment_type === "non-ambient" && !value
          ? "pressure_measurement_location is required for non-ambient experiments"
          : true,
      admin: {
        condition: ({ experiment_type }) => experiment_type === "non-ambient",
      },
    },
    {
      name: "chamber_type",
      type: "relationship",
      relationTo: ChamberTypes.slug,
      // @ts-expect-error
      validate: (value, { data: { experiment_type } }): true | string =>
        experiment_type === "non-ambient" && !value
          ? "chamber_type is required for non-ambient experiments"
          : true,
      admin: {
        condition: ({ experiment_type }) => experiment_type === "non-ambient",
      },
    },
    {
      name: "opening_angle",
      type: "select",
      options: ["30", "40", "50"],
      // @ts-expect-error
      validate: (value, { data: { experiment_type } }): true | string =>
        experiment_type === "non-ambient" && !value
          ? "opening_angle is required for non-ambient experiments"
          : true,
      admin: {
        condition: ({ experiment_type }) => experiment_type === "non-ambient",
      },
    },
    {
      name: "pressure_medium",
      type: "text",
      maxLength: 100,
      // @ts-expect-error
      validate: (value, { data: { experiment_type } }): true | string =>
        experiment_type === "non-ambient" && !value
          ? "pressure_medium is required for non-ambient experiments"
          : true,
      admin: {
        condition: ({ experiment_type }) => experiment_type === "non-ambient",
      },
    },
    // TODO: not sure how we're going to handle this yet
    // {
    //   name: "data_location",
    //   type: "text",
    //   ...
    // },
    {
      name: "comment",
      type: "textarea",
      maxLength: 500,
    },
  ],
};
