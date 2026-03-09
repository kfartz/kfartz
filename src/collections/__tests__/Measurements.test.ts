import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { deg2rad } from "@/utils/utils";

let payload: Awaited<ReturnType<typeof getPayload>>;

describe("Measurements Collection", () => {
  let crystalId: number;
  let chamberTypeId: number;

  beforeAll(async () => {
    payload = await getPayload({
      config: configPromise,
    });

    // Create prerequisite data
    const crystal = await payload.create({
      collection: "crystals",
      data: {
        source: "Test Source",
        name: "Test Crystal",
        dimensions: { max: 10, mid: 5, min: 2 },
        color: { a: "clear", b: "light", c: "colorless" },
        shape: "block",
      },
    });
    crystalId = crystal.id;

    const chamber = await payload.create({
      collection: "chamber-types",
      data: {
        name: "Diamond Anvil Cell",
      },
    });
    chamberTypeId = chamber.id;
  });

  afterAll(async () => {
    if (payload) {
      await payload.delete({
        collection: "measurements",
        where: { name: { equals: "Test Measurement" } },
      });
      if (crystalId) {
        await payload.delete({
          collection: "crystals",
          id: crystalId,
        });
      }
      if (chamberTypeId) {
        await payload.delete({
          collection: "chamber-types",
          id: chamberTypeId,
        });
      }
    }
  });

  it("should calculate resolution correctly via afterRead hook", async () => {
    const wavelength = 0.71073;
    const theta_max = 25.0;

    const measurement = await payload.create({
      collection: "measurements",
      data: {
        crystal: crystalId,
        name: "Test Measurement",
        pi_name: "Dr. Smith",
        grant_id: "GRANT123",
        operator_name: "John Doe",
        facility_name: "Lab 1",
        measurement_starting_date: new Date().toISOString(),
        experiment_type: "single crystal",
        _diffrn_radiation_wavelength: wavelength,
        _diffrn_reflns_theta_max: theta_max,
      },
    });

    // Verify it saved
    expect(measurement.id).toBeDefined();

    // Re-fetch to trigger afterRead hook
    const fetched = await payload.findByID({
      collection: "measurements",
      id: measurement.id,
    });

    // Calculation: wavelength / 2 / sin(deg2rad * theta_max)
    const expectedResolution = wavelength / 2 / Math.sin(deg2rad * theta_max);

    expect(fetched.resolution).toBeDefined();
    expect(fetched.resolution).toBeCloseTo(expectedResolution, 5);
  });

  it("should fail validation for non-ambient experiments if required fields are missing", async () => {
    // Attempt to create a non-ambient measurement without the required fields
    let error: unknown;
    try {
      await payload.create({
        collection: "measurements",
        data: {
          crystal: crystalId,
          name: "Test Measurement",
          pi_name: "Dr. Smith",
          grant_id: "GRANT123",
          operator_name: "John Doe",
          facility_name: "Lab 1",
          measurement_starting_date: new Date().toISOString(),
          experiment_type: "non-ambient",
          // Missing pressure, pressure_measurement_location, etc.
        },
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain(
      "The following fields are invalid: Pressure, Pressure_measurement_location, Chamber_type, Opening_angle, Pressure_medium",
    );
  });

  it("should pass validation for non-ambient experiments if all required fields are provided", async () => {
    const measurement = await payload.create({
      collection: "measurements",
      data: {
        crystal: crystalId,
        name: "Test Measurement",
        pi_name: "Dr. Smith",
        grant_id: "GRANT123",
        operator_name: "John Doe",
        facility_name: "Lab 1",
        measurement_starting_date: new Date().toISOString(),
        experiment_type: "non-ambient",
        pressure: 10,
        pressure_measurement_location: "Center",
        chamber_type: chamberTypeId,
        opening_angle: "40",
        pressure_medium: "Methanol-Ethanol",
      },
    });

    expect(measurement.id).toBeDefined();
    expect(measurement.pressure).toBe(10);
    expect(
      typeof measurement.chamber_type === "object" &&
        measurement.chamber_type !== null
        ? measurement.chamber_type.id
        : measurement.chamber_type,
    ).toBe(chamberTypeId);
  });
});
