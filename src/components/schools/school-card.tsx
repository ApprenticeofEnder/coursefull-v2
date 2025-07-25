"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useSchoolStore } from "~/lib/stores";
import type { School } from "~/server/db/schema";

export function SchoolCard({ school }: { school: School }) {
  const schoolStore = useSchoolStore();

  const { name, stateOrProvince, country } = school;

  async function enroll() {
    schoolStore.addSchool(school);
  }
  // TODO: Add button to enroll the user in the school
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {stateOrProvince ? `${stateOrProvince}, ` : ""}
          {country}
        </CardDescription>
        <CardAction>
          <Button>Enroll</Button>
        </CardAction>
      </CardHeader>
      {/* <CardContent> */}
      {/*   <p>Content</p> */}
      {/* </CardContent> */}
      {/* <CardFooter> */}
      {/*   <p>Go</p> */}
      {/* </CardFooter> */}
    </Card>
  );
}
