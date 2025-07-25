import { readFile } from "node:fs/promises";

import { env } from "~/env";
import { db } from "~/server/db";
import { type NewSchool, schools } from "~/server/db/schema";
import { getLogger } from "~/server/logger";

interface RawSchool {
  name: string;
  domains: string[];
  web_domains: string[];
  country: string;
  alpha_two_code: string;
  "state-province": string | null;
}

async function loadUniversities() {
  const logger = getLogger();
  try {
    const schoolDataRaw = await readFile(env.UNIVERSITY_DATA_FILE, "utf8");
    const schoolData: NewSchool[] = JSON.parse(schoolDataRaw).map(
      (rawSchool: RawSchool) => {
        return {
          name: rawSchool.name,
          domains: rawSchool.domains,
          webPages: rawSchool.web_domains,
          country: rawSchool.country,
          stateOrProvince: rawSchool["state-province"],
          alphaTwoCode: rawSchool.alpha_two_code,
        } as NewSchool;
      },
    );

    const insertResult = await db
      .insert(schools)
      .values(schoolData)
      .onConflictDoNothing()
      .returning();

    logger
      .withMetadata({ records: insertResult.length })
      .info("Inserted data successfully.");
  } catch (error) {
    logger.withError(error).error("Unexpected error occurred.");
  }
}

loadUniversities().then(() => {
  process.exit(0);
});
