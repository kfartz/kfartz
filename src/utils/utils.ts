import type { GroupField } from "payload";

type FlattenableObject = {
  [key in string]: string | number | null | FlattenableObject;
};

export const flattenToString = (obj: FlattenableObject): string =>
  Object.values(obj)
    .map((val) =>
      !val
        ? ""
        : typeof val === "object"
          ? flattenToString(val)
          : val.toString(),
    )
    .join(" ");

export const deg2rad = Math.PI / 180;

export const measurementWithUncertainty = (name: string): GroupField => ({
  name,
  type: "group",
  fields: [
    { name: "measurement", type: "number" },
    { name: "uncertainty", type: "number" },
  ],
});
