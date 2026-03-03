import { describe, expect, it } from "bun:test";
import { cn } from "../utils";

describe("cn", () => {
  it("should return a single class string unchanged", () => {
    expect(cn("p-4")).toBe("p-4");
  });

  it("should merge multiple class strings", () => {
    expect(cn("p-4", "text-red-500")).toBe("p-4 text-red-500");
  });

  it("should resolve conflicting Tailwind classes (last wins)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
  });

  it("should handle conditional classes via clsx syntax", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("should handle undefined and null inputs", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });

  it("should return empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});
