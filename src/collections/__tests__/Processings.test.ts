import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import configPromise from "@payload-config";
import { getPayload } from "payload";

let payload: Awaited<ReturnType<typeof getPayload>>;

describe("Processings Collection", () => {
  let crystalId: number;
  let measurementId: number;

  beforeAll(async () => {
    payload = await getPayload({ config: configPromise });

    // Prerequisite data
    const crystal = await payload.create({
      collection: "crystals",
      data: {
        source: "Processing Test Source",
        name: "Processing Test Crystal",
        dimensions: { max: 10, mid: 5, min: 2 },
        color: { a: "clear", b: "light", c: "colorless" },
        shape: "block",
      },
    });
    crystalId = crystal.id;

    const measurement = await payload.create({
      collection: "measurements",
      data: {
        crystal: crystalId,
        name: "Processing Test Measurement",
        pi_name: "Dr. Smith",
        grant_id: "GRANT123",
        operator_name: "John Doe",
        facility_name: "Lab 1",
        measurement_starting_date: new Date().toISOString(),
        experiment_type: "single crystal",
      },
    });
    measurementId = measurement.id;
  });

  afterAll(async () => {
    if (payload) {
      if (measurementId) {
        await payload.delete({ collection: "measurements", id: measurementId });
      }
      if (crystalId) {
        await payload.delete({ collection: "crystals", id: crystalId });
      }
    }
  });

  it("should create a processing entry with required fields", async () => {
    const processing = await payload.create({
      collection: "processings",
      data: {
        author: "Alice Processor",
        measurement: measurementId,
        name: "Test Processing 1",
        _diffrn_reflns_theta_min: 1.5,
        _diffrn_reflns_theta_max: 25.0,
      },
    });

    expect(processing.id).toBeDefined();
    expect(processing.author).toBe("Alice Processor");
    expect(
      typeof processing.measurement === "object" &&
        processing.measurement !== null
        ? processing.measurement.id
        : processing.measurement,
    ).toBe(measurementId);

    // cleanup
    await payload.delete({ collection: "processings", id: processing.id });
  });

  it("should fail validation if measurement is missing", async () => {
    let error: unknown;
    try {
      await payload.create({
        collection: "processings",
        data: {
          author: "Alice Processor",
          name: "Test Processing Error",
        } as never,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain(
      "The following field is invalid: Measurement",
    );
  });
});
