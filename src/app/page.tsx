import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { HydrateClient, api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  return (
    <HydrateClient>
      <div>Hello, world!</div>
    </HydrateClient>
  );
}
