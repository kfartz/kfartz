import type { CollectionConfig } from "payload";

export const Crystals: CollectionConfig & { slug: "crystals" } = {
  slug: "crystals",
  admin: {
    description: "Crystal sample data 🔮",
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user?.admin,
    update: ({ req: { user } }) => !!user?.admin,
  },

  fields: [
    {
      name: "source",
      type: "text",
      required: true,
    },
    {
      name: "id",
      type: "text",
      required: true,
    },
    {
      name: "dimensions",
      type: "group",
      required: true,
      fields: [
        {
          name: "max",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "mid",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "min",
          type: "number",
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: "color",
      type: "group",
      required: true,
      fields: [
        {
          name: "a",
          type: "select",
          required: false,
          options: ["clear", "dull", "metallic", "opalescent"],
        },
        {
          name: "b",
          type: "select",
          required: false,
          options: [
            "light",
            "dark",
            "whitish",
            "blackish",
            "greyish",
            "brownish",
            "yellowish",
            "reddish",
            "blueish",
            "greenish",
            "pinkish",
            "orangeish",
          ],
        },
        {
          name: "c",
          type: "select",
          required: true,
          options: [
            "colorless",
            "black",
            "white",
            "grey",
            "brown",
            "yellow",
            "red",
            "blue",
            "green",
            "pink",
            "violet",
            "orange",
          ],
        },
      ],
    },
    {
      name: "shape",
      type: "select",
      required: true,
      options: [
        "block",
        "plate",
        "needle",
        "prism",
        "plank",
        "irregular",
        "cube",
        "trapezoid",
        "hexagonal",
        "octahedral",
        "rhobohedral",
        "spherical",
      ],
    },
  ],
};
