import Link from "next/link";

import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <div>Welcome to CourseFull!</div>
      <div>
        <Link href="/schools">Schools</Link>
      </div>
      <div>
        <Link href="/semesters">Semesters</Link>
      </div>
    </HydrateClient>
  );
}
