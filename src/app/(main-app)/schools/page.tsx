import Link from "next/link";

import { SchoolSearch } from "~/components/schools";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Schools() {
  const session = await auth();
  // TODO: Add authorization checks on the front end?
  void api.school.search.prefetch({ limit: 25, page: 1 });

  return (
    <HydrateClient>
      <h1>Schools</h1>
      <SchoolSearch></SchoolSearch>
    </HydrateClient>
  );
}
