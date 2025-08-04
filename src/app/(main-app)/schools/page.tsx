import Link from "next/link";
import dynamic from "next/dynamic";

import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

const SchoolSearch = dynamic(() => import("~/components/schools").then(mod => ({ default: mod.SchoolSearch })), {
  loading: () => <div>Loading search...</div>
});

export default async function Schools() {
  const session = await auth();
  void api.school.search.prefetch({ limit: 25, page: 1 });

  return (
    <HydrateClient>
      <h1>Schools</h1>
      <SchoolSearch></SchoolSearch>
    </HydrateClient>
  );
}
