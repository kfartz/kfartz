import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  access: {
    admin: ({ req: { user } }) => !!user?.admin,
  },
  auth: {
    tokenExpiration: 60 * 60 * 24,
    maxLoginAttempts: 5,
    lockTime: 60 * 15,
  },
  fields: [
    {
      name: "admin",
      type: "checkbox",
      defaultValue: false,
      required: true,
    },
  ],
};
