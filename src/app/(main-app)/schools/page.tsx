import Link from "next/link";

import { SchoolList } from "~/components/schools";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Schools() {
  const session = await auth();
  // TODO: Add authorization checks on the front end
  void api.school.getAll.prefetch();

  return (
    <HydrateClient>
      <h1>Schools</h1>
      <SchoolList></SchoolList>
    </HydrateClient>
  );
}
