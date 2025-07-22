"use client";

import { useCallback, useEffect, useState } from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/react";

export function SchoolList() {
  const [schools] = api.school.getAll.useSuspenseQuery();
  const ping = api.school.ping.useQuery({}, { staleTime: 0 });

  if (!schools) {
    return <p>No schools found.</p>;
  }

  return (
    <div className="flex flex-col">
      {schools.map((school) => {
        return (
          <SchoolCard key={school.publicId} name={school.name}></SchoolCard>
        );
      })}
    </div>
  );
}

export function SchoolCard({ name }: { name: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>A school among schools...</CardDescription>
        <CardAction>Beep</CardAction>
      </CardHeader>
      <CardContent>
        <p>Content</p>
      </CardContent>
      <CardFooter>
        <p>Go</p>
      </CardFooter>
    </Card>
  );
}
