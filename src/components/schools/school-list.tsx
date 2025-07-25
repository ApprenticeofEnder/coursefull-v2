"use client";

import { SchoolCard } from "~/components/schools/school-card";
import type { School } from "~/server/db/schema";
import { api } from "~/trpc/react";

export function SchoolList({ schools }: { schools: School[] | undefined }) {
  if (!schools) {
    return <p>No schools found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {schools.map((school) => {
        return <SchoolCard key={school.publicId} school={school}></SchoolCard>;
      })}
    </div>
  );
}
