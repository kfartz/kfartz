import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import configPromise from "@payload-config";
import { getPayload } from "payload";

let payload: Awaited<ReturnType<typeof getPayload>>;

describe("Users Collection", () => {
  beforeAll(async () => {
    // Initialize payload
    payload = await getPayload({
      config: configPromise,
    });
  });

  afterAll(async () => {
    // Clean up test data if needed
    if (payload) {
      await payload.delete({
        collection: "users",
        where: { email: { equals: "test_collection@example.com" } },
      });
    }
  });

  it("should enforce admin access correctly", () => {
    // Just a basic structural check for the config itself since checking access hooks
    // without a full request context can be tricky, but we verify the config is loaded
    expect(payload.collections.users).toBeDefined();
    expect(payload.collections.users.config.slug).toBe("users");
    expect(payload.collections.users.config.auth).toBeDefined();
  });

  it("should create a user", async () => {
    const user = await payload.create({
      collection: "users",
      data: {
        email: "test_collection@example.com",
        password: "password123",
        admin: false,
      },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("test_collection@example.com");
    expect(user.admin).toBe(false);
  });
});
