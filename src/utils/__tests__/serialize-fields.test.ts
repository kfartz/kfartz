import { describe, expect, it } from "bun:test";
import type { Field } from "payload";
import { serializeFields } from "../serialize-fields";

describe("serializeFields", () => {
  it("should filter out createdAt and updatedAt fields", () => {
    const fields: Field[] = [
      { name: "title", type: "text" },
      { name: "createdAt", type: "date" },
      { name: "updatedAt", type: "date" },
    ];
    const result = serializeFields(fields);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("title");
  });

  it("should serialize basic text/number/checkbox/date fields", () => {
    const fields: Field[] = [
      { name: "title", type: "text", required: true },
      { name: "count", type: "number", min: 0, max: 100 },
      { name: "active", type: "checkbox" },
      { name: "published", type: "date" },
    ];
    const result = serializeFields(fields);
    expect(result).toEqual([
      {
        name: "title",
        type: "text",
        required: true,
        min: undefined,
        max: undefined,
      },
      {
        name: "count",
        type: "number",
        required: false,
        min: 0,
        max: 100,
      },
      {
        name: "active",
        type: "checkbox",
        required: false,
        min: undefined,
        max: undefined,
      },
      {
        name: "published",
        type: "date",
        required: false,
        min: undefined,
        max: undefined,
      },
    ]);
  });

  it("should handle select fields with string options", () => {
    const fields: Field[] = [
      {
        name: "color",
        type: "select",
        options: ["red", "green", "blue"],
      },
    ];
    const result = serializeFields(fields);
    expect(result[0].options).toEqual(["red", "green", "blue"]);
  });

  it("should handle select fields with label/value options", () => {
    const fields: Field[] = [
      {
        name: "shape",
        type: "select",
        options: [
          { label: "Circle", value: "circle" },
          { label: "Square", value: "square" },
        ],
      },
    ];
    const result = serializeFields(fields);
    expect(result[0].options).toEqual([
      { label: "Circle", value: "circle" },
      { label: "Square", value: "square" },
    ]);
  });

  it("should handle relationship fields with string relationTo", () => {
    const fields: Field[] = [
      {
        name: "author",
        type: "relationship",
        relationTo: "users",
      },
    ];
    const result = serializeFields(fields);
    expect(result[0].relationTo).toBe("users");
  });

  it("should not set relationTo for relationship fields with array relationTo", () => {
    const fields: Field[] = [
      {
        name: "linked",
        type: "relationship",
        relationTo: ["users", "posts"] as never,
      },
    ];
    const result = serializeFields(fields);
    expect(result[0].relationTo).toBeUndefined();
  });

  it("should recursively serialize group fields", () => {
    const fields: Field[] = [
      {
        name: "dimensions",
        type: "group",
        fields: [
          { name: "width", type: "number" },
          { name: "height", type: "number" },
        ],
      },
    ];
    const result = serializeFields(fields);
    expect(result[0].fields).toHaveLength(2);
    expect(result[0].fields?.[0].name).toBe("width");
    expect(result[0].fields?.[1].name).toBe("height");
  });

  it("should recursively serialize array fields", () => {
    const fields: Field[] = [
      {
        name: "items",
        type: "array",
        fields: [
          { name: "label", type: "text" },
          { name: "createdAt", type: "date" },
        ],
      },
    ];
    const result = serializeFields(fields);
    // createdAt inside array fields should also be filtered
    expect(result[0].fields).toHaveLength(1);
    expect(result[0].fields?.[0].name).toBe("label");
  });

  it("should assign 'unnamed-field' for fields without a name property", () => {
    // UI-type fields (like tabs) don't have a name property
    const fields = [{ type: "ui" }] as Field[];
    const result = serializeFields(fields);
    expect(result[0].name).toBe("unnamed-field");
  });

  it("should default required to false when not specified", () => {
    const fields: Field[] = [{ name: "title", type: "text" }];
    const result = serializeFields(fields);
    expect(result[0].required).toBe(false);
  });

  it("should default min and max to undefined when not specified", () => {
    const fields: Field[] = [{ name: "title", type: "text" }];
    const result = serializeFields(fields);
    expect(result[0].min).toBeUndefined();
    expect(result[0].max).toBeUndefined();
  });
});
