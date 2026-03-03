import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { User } from "@/payload-types";

// Keep a cached payload instance
let cachedPayload: Awaited<ReturnType<typeof getPayload>> | null = null;

export const initPayloadForTest = async () => {
  if (cachedPayload) return cachedPayload;

  cachedPayload = await getPayload({ config: configPromise });
  return cachedPayload;
};

export const clearDatabase = async () => {
  const payload = await initPayloadForTest();

  // Need to clear in order of dependencies (leaves to roots)
  const collections = ["measurements", "chamber-types", "crystals", "users"];

  for (const collection of collections) {
    await payload.delete({
      collection: collection as Parameters<
        typeof payload.delete
      >[0]["collection"],
      where: { id: { exists: true } },
    });
  }
};

export const seedTestUser = async (): Promise<User> => {
  const payload = await initPayloadForTest();

  const existingUsers = await payload.find({
    collection: "users",
    where: { email: { equals: "e2e@example.com" } },
  });

  if (existingUsers.docs.length > 0) {
    return existingUsers.docs[0] as unknown as User;
  }

  return (await payload.create({
    collection: "users",
    data: {
      email: "e2e@example.com",
      password: "password123",
      admin: true,
    },
  })) as unknown as User;
};

export const seedBaselineData = async () => {
  const payload = await initPayloadForTest();

  // Seed a crystal
  const crystal = await payload.create({
    collection: "crystals",
    data: {
      name: "E2E Crystal",
      source: "Synthesized in lab",
      dimensions: { max: 10, mid: 5, min: 2 },
      color: { c: "blue" },
      shape: "prism",
    },
  });

  // Seed a measurement
  const measurement = await payload.create({
    collection: "measurements",
    data: {
      crystal: crystal.id as number,
      name: "E2E Measurement",
      pi_name: "Dr. E2E",
      grant_id: "GRANT-E2E-01",
      operator_name: "E2E Bot",
      facility_name: "E2E Testing Facility",
      measurement_starting_date: new Date().toISOString(),
      experiment_type: "single crystal",
      _diffrn_radiation_wavelength: 0.71073,
      _diffrn_reflns_theta_max: 25.0,
    },
  });

  return { crystal, measurement };
};
