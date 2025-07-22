import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Semesters() {
  const session = await auth();

  return (
    <HydrateClient>
      <div>Welcome to CourseFull!</div>
    </HydrateClient>
  );
}
