import { createId } from "@paralleldrive/cuid2";
import { describe, expect, test } from "vitest";

import { deleteValue, getValue } from "~/server/cache";
import { courses, deliverables, schools, semesters } from "~/server/db/schema";

// INFO: These are just sanity checks, in-depth tests can come later.
// INFO: There WERE tests here, but I left the file in just in case.
