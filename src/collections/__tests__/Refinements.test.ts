import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import configPromise from "@payload-config";
import { getPayload } from "payload";

let payload: Awaited<ReturnType<typeof getPayload>>;

describe("Refinements Collection", () => {
  let crystalId: number;
  let measurementId: number;
  let processingId: number;

  beforeAll(async () => {
    payload = await getPayload({ config: configPromise });

    // Prerequisite data chain
    const crystal = await payload.create({
      collection: "crystals",
      data: {
        source: "Refinement Test Source",
        name: "Refinement Test Crystal",
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
        name: "Refinement Test Measurement",
        pi_name: "Dr. Smith",
        grant_id: "GRANT123",
        operator_name: "John Doe",
        facility_name: "Lab 1",
        measurement_starting_date: new Date().toISOString(),
        experiment_type: "single crystal",
      },
    });
    measurementId = measurement.id;

    const processing = await payload.create({
      collection: "processings",
      data: {
        author: "Alice Processor",
        measurement: measurementId,
        name: "Test Processing",
      },
    });
    processingId = processing.id;
  });

  afterAll(async () => {
    if (payload) {
      if (processingId) {
        await payload.delete({ collection: "processings", id: processingId });
      }
      if (measurementId) {
        await payload.delete({ collection: "measurements", id: measurementId });
      }
      if (crystalId) {
        await payload.delete({ collection: "crystals", id: crystalId });
      }
    }
  });

  it("should create a refinement entry linking to processings", async () => {
    const refinement = await payload.create({
      collection: "refinements",
      data: {
        author: "Bob Refiner",
        name: "Test Refinement 1",
        disorder: false,
        solvent_masking: false,
        aspherical_atom_model: "IAM",
        processings: [{ processing: processingId }],
        _chemical_formula_sum: "C10 H8 N2 O4",
        "_space_group_name_H-M_alt": "P 21/c",
      },
    });

    expect(refinement.id).toBeDefined();
    expect(refinement.author).toBe("Bob Refiner");
    expect(refinement.aspherical_atom_model).toBe("IAM");
    expect(refinement.processings?.[0]?.processing).toBeDefined();

    // cleanup
    await payload.delete({ collection: "refinements", id: refinement.id });
  });

  it("should enforce required fields and arrays", async () => {
    let error: unknown;
    try {
      await payload.create({
        collection: "refinements",
        data: {
          author: "Bob Refiner",
          name: "Test Refinement Error",
          // missing disorder, solvent_masking, aspherical_atom_model, processings
        } as never,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    // Payload usually mentions missing required fields
    expect(error.message).toContain("invalid");
  });
});
