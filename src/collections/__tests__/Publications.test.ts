import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import configPromise from "@payload-config";
import { getPayload } from "payload";

let payload: Awaited<ReturnType<typeof getPayload>>;

describe("Publications Collection", () => {
  let crystalId: number;
  let measurementId: number;
  let processingId: number;
  let refinementId: number;

  beforeAll(async () => {
    payload = await getPayload({ config: configPromise });

    // Prerequisites
    const crystal = await payload.create({
      collection: "crystals",
      data: {
        source: "Pub Test Source",
        name: "Pub Test Crystal",
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
        name: "Pub Test Measurement",
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
        name: "Pub Test Processing",
      },
    });
    processingId = processing.id;

    const refinement = await payload.create({
      collection: "refinements",
      data: {
        author: "Bob Refiner",
        name: "Pub Test Refinement",
        disorder: false,
        solvent_masking: false,
        aspherical_atom_model: "IAM",
        processings: [{ processing: processingId }],
      },
    });
    refinementId = refinement.id;
  });

  afterAll(async () => {
    if (payload) {
      if (refinementId) {
        await payload.delete({ collection: "refinements", id: refinementId });
      }
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

  it("should create a publication linked to a refinement", async () => {
    const publication = await payload.create({
      collection: "publications",
      data: {
        doi: "10.1000/xyz123",
        name: "Important Crystal Structure Discovery",
        refinements: [{ refinement: refinementId }],
      },
    });

    expect(publication.id).toBeDefined();
    expect(publication.doi).toBe("10.1000/xyz123");
    expect(publication.refinements?.[0]?.refinement).toBeDefined();

    // cleanup
    await payload.delete({ collection: "publications", id: publication.id });
  });

  it("should fail validation if doi is missing", async () => {
    let error: unknown;
    try {
      await payload.create({
        collection: "publications",
        data: {
          name: "Invalid Pub",
          refinements: [{ refinement: refinementId }],
        } as never,
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.message).toContain("invalid");
  });
});
