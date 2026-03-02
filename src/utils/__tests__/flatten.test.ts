import { describe, expect, it } from "bun:test";
import { flattenObject } from "../flatten";

describe("flattenObject", () => {
  it("should flatten a flat object unchanged", () => {
    const obj = { a: 1, b: "hello", c: true };
    expect(flattenObject(obj)).toEqual({ a: 1, b: "hello", c: true });
  });

  it("should flatten nested objects with dot-notation keys", () => {
    const obj = { a: 1, b: { c: "hello", d: 2 } };
    expect(flattenObject(obj)).toEqual({ a: 1, "b.c": "hello", "b.d": 2 });
  });

  it("should handle deeply nested objects (3+ levels)", () => {
    const obj = { a: { b: { c: { d: "deep" } } } };
    expect(flattenObject(obj)).toEqual({ "a.b.c.d": "deep" });
  });

  it("should pass array values through as-is", () => {
    const obj = { a: [1, 2, 3], b: "hello" };
    expect(flattenObject(obj)).toEqual({ a: [1, 2, 3], b: "hello" });
  });

  it("should return empty object for empty input", () => {
    expect(flattenObject({})).toEqual({});
  });

  it("should handle null values as leaf nodes (not recursed into)", () => {
    const obj = { a: null, b: "hello" };
    const result = flattenObject(obj as never);
    // null is not an object, so it goes to the else branch and is stored as-is
    expect(result.b).toBe("hello");
    expect("a" in result).toBe(true);
  });

  it("should handle undefined values as leaf nodes", () => {
    const obj = { a: undefined, b: "test" };
    const result = flattenObject(obj as never);
    expect(result.b).toBe("test");
    expect("a" in result).toBe(true);
  });

  it("should handle mixed nesting with arrays and primitives", () => {
    const obj = { a: 1, b: { c: [1, 2], d: { e: "deep" } }, f: true };
    expect(flattenObject(obj)).toEqual({
      a: 1,
      "b.c": [1, 2],
      "b.d.e": "deep",
      f: true,
    });
  });
});
