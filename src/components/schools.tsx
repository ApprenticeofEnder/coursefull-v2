"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SelectContent, SelectItem } from "@radix-ui/react-select";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { School } from "~/server/db/schema";
import { api } from "~/trpc/react";

const schoolSearchSchema = z.object({
  name: z.string().or(z.undefined()),
  alphaTwoCode: z.string().or(z.undefined()),
  page: z.number(),
  limit: z.number(),
});

type SchoolSearch = z.infer<typeof schoolSearchSchema>;

export function SchoolSearch() {
  const form = useForm<SchoolSearch>({
    resolver: zodResolver(schoolSearchSchema),
    defaultValues: {
      limit: 25,
      page: 1,
    },
  });
  const [schools, schoolQuery] = api.school.search.useSuspenseQuery(
    form.getValues(),
  );

  function onSubmit() {
    void schoolQuery.refetch();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School Name</FormLabel>
                <FormControl>
                  <Input {...field}></Input>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alphaTwoCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue></SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="page"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value, 10);
                      field.value = parsed;
                      field.onChange();
                    }}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Items Per Page</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="10"
                    max="100"
                    onChange={(e) => {
                      const parsed = parseInt(e.target.value, 10);
                      field.value = parsed;
                      field.onChange();
                    }}
                    defaultValue={field.value}
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <Button type="submit">Search</Button>
        </form>
      </Form>
      <SchoolList schools={schools}></SchoolList>
    </div>
  );
}

export function SchoolList({ schools }: { schools: School[] | undefined }) {
  if (!schools) {
    return <p>No schools found.</p>;
  }

  return (
    <div className="flex flex-col">
      {schools.map((school) => {
        return <SchoolCard key={school.publicId} {...school}></SchoolCard>;
      })}
    </div>
  );
}

export function SchoolCard({ name }: School) {
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
