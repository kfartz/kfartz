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

export type CIFNumberWithUncertainty = {
  value: number;
  uncertainty: number;
};
export type CIFValue = string | number | CIFNumberWithUncertainty;

export const cifValueForKey = (cif: string, key: string): CIFValue | null =>
  cifValueFromString(
    cif
      .split("\n")
      .filter(Boolean)
      .map((s) => s.split(/\s+/))
      .find((l) => l[0] === key && l.length === 2)?.[1] || null,
  );

const cifValueFromString = (s: string | null): CIFValue | null =>
  !s
    ? null
    : /\d+(\.\d+)?\(\d+\)/.test(s)
      ? (s
          .split(/[()]/, 2)
          .map(Number)
          .reduce(
            (acc, val, idx) =>
              // biome-ignore lint: ) :
              idx === 0 ? { value: val } : { ...acc, uncertainty: val },
            {},
          ) as CIFNumberWithUncertainty)
      : Number.isNaN(Number(s))
        ? s
        : Number(s);
