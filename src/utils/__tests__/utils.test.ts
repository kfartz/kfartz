import { describe, expect, it } from "bun:test";
import { cifValueForKey, flattenToString } from "../utils";

describe("utils.ts", () => {
  describe("flattenToString", () => {
    it("should flatten a simple object to a string", () => {
      const obj = { a: 1, b: "hello" };
      expect(flattenToString(obj as Record<string, unknown>)).toBe("1 hello");
    });

    it("should handle nested objects", () => {
      const obj = { a: 1, b: { c: "hello", d: 2 } };
      expect(flattenToString(obj as Record<string, unknown>)).toBe("1 hello 2");
    });

    it("should ignore null and undefined values", () => {
      const obj = { a: 1, b: null, c: undefined, d: "hello" };
      expect(flattenToString(obj as Record<string, unknown>)).toBe("1   hello"); // Extra spaces due to .join(" ")
    });
  });

  describe("cifValueForKey", () => {
    it("should extract string values from CIF string", () => {
      const cif = `_cell_length_a  10.0\n_cell_length_b  "test value"\n_cell_length_c  'another value'`;
      expect(cifValueForKey(cif, "_cell_length_b")).toBe("test value");
      expect(cifValueForKey(cif, "_cell_length_c")).toBe("another value");
    });

    it("should extract number values from CIF string", () => {
      const cif = `_cell_length_a  10.5\n_cell_length_b  20`;
      expect(cifValueForKey(cif, "_cell_length_a")).toBe(10.5);
      expect(cifValueForKey(cif, "_cell_length_b")).toBe(20);
    });

    it("should extract values with uncertainties", () => {
      const cif = `_cell_length_a  10.542(3)\n_cell_angle_alpha  90.0(2)`;
      expect(cifValueForKey(cif, "_cell_length_a")).toEqual({
        value: 10.542,
        uncertainty: 3,
      });
      expect(cifValueForKey(cif, "_cell_angle_alpha")).toEqual({
        value: 90.0,
        uncertainty: 2,
      });
    });

    it("should return null for missing keys", () => {
      const cif = `_cell_length_a  10.5\n_cell_length_b  20`;
      expect(cifValueForKey(cif, "_cell_length_c")).toBeNull();
    });
  });
});
