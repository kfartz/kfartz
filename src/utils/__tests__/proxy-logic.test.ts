import { describe, expect, it } from "bun:test";
import { getProxyDecision } from "../proxy-logic";

describe("getProxyDecision", () => {
  const baseUrl = "http://localhost:3000";

  it("should redirect unauthenticated user to /login from a non-login page", () => {
    const result = getProxyDecision(null, `${baseUrl}/crystals`);
    expect(result).toEqual({
      action: "redirect",
      url: `${baseUrl}/login`,
    });
  });

  it("should redirect unauthenticated user to /login from root", () => {
    const result = getProxyDecision(null, `${baseUrl}/`);
    expect(result).toEqual({
      action: "redirect",
      url: `${baseUrl}/login`,
    });
  });

  it("should allow unauthenticated user to stay on /login (passthrough)", () => {
    const result = getProxyDecision(null, `${baseUrl}/login`);
    expect(result).toEqual({ action: "next" });
  });

  it("should redirect authenticated user away from /login to /", () => {
    const user = { id: "1", email: "test@test.com" };
    const result = getProxyDecision(user, `${baseUrl}/login`);
    expect(result).toEqual({
      action: "redirect",
      url: `${baseUrl}/`,
    });
  });

  it("should allow authenticated user on normal pages (passthrough)", () => {
    const user = { id: "1", email: "test@test.com" };
    const result = getProxyDecision(user, `${baseUrl}/crystals`);
    expect(result).toEqual({ action: "next" });
  });

  it("should allow authenticated user on root (passthrough)", () => {
    const user = { id: "1", email: "test@test.com" };
    const result = getProxyDecision(user, `${baseUrl}/`);
    expect(result).toEqual({ action: "next" });
  });
});
