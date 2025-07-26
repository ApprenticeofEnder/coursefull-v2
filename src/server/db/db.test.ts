import { createId } from "@paralleldrive/cuid2";
import { describe, expect, test } from "vitest";

import { deleteValue, getValue } from "~/server/cache";
import { courses, deliverables, schools, semesters } from "~/server/db/schema";
import {
  cachePublicId,
  constructTableDiscriminantId,
  deconstructTableDiscriminantId,
  invalidatePublicId,
} from "~/server/db/schema/common";

// INFO: These are just sanity checks, in-depth tests can come later.

const testCases = [
  {
    discriminant: "coursefull_school_1",
    table: schools,
    internalId: 1,
  },
  {
    discriminant: "coursefull_semester_1",
    table: semesters,
    internalId: 1,
  },
  {
    discriminant: "coursefull_course_1",
    table: courses,
    internalId: 1,
  },
  {
    discriminant: "coursefull_deliverable_1",
    table: deliverables,
    internalId: 1,
  },
].map((testCase) => ({ ...testCase, publicId: createId() }));

describe("constructTableDiscriminantId", () => {
  test("gives the correct table name", () => {
    testCases.forEach(({ discriminant, table, internalId }) => {
      expect(constructTableDiscriminantId(internalId, table)).toEqual(
        discriminant,
      );
    });
  });
});

describe("deconstructTableDiscriminantId", () => {
  test("gives the correct ID", () => {
    testCases.forEach(({ discriminant, table, internalId }) => {
      expect(deconstructTableDiscriminantId(discriminant, table)).toEqual(
        internalId,
      );
    });
  });
});

describe("cachePublicId", () => {
  test("sets bidirectional cache", async () => {
    const tests = testCases.map(
      async ({ table, internalId, publicId, discriminant }) => {
        await cachePublicId(publicId, internalId, table);
        expect(await getValue(publicId)).toEqual(discriminant);
        expect(await getValue(discriminant)).toEqual(publicId);
        await deleteValue(publicId);
        await deleteValue(discriminant);
      },
    );

    await Promise.all(tests);
  });
});

describe("invalidatePublicId", () => {
  test("invalidates cache", async () => {
    const tests = testCases.map(
      async ({ table, internalId, publicId, discriminant }) => {
        await cachePublicId(publicId, internalId, table);
        await invalidatePublicId(publicId, internalId, table);
        expect(await getValue(publicId)).toEqual(null);
        expect(await getValue(discriminant)).toEqual(null);
      },
    );
    await Promise.all(tests);
  });
});
