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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { School } from "~/server/db/schema";
import { api } from "~/trpc/react";

const schoolSearchSchema = z.object({
  name: z.string(),
  alphaTwoCode: z.string().or(z.undefined()),
  page: z.number(),
  limit: z.number(),
});

type SchoolSearch = z.infer<typeof schoolSearchSchema>;

const pageSizes = [10, 25, 50, 100];

export function SchoolSearch() {
  const form = useForm<SchoolSearch>({
    resolver: zodResolver(schoolSearchSchema),
    defaultValues: {
      limit: 25,
      page: 1,
      name: "",
    },
  });
  const [{ schools, pages }, schoolQuery] = api.school.search.useSuspenseQuery(
    form.getValues(),
  );

  function onSubmit() {
    if (form.getFieldState("name").isDirty) {
      form.setValue("page", 1);
    }
    void schoolQuery.refetch();
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="School Name" {...field}></Input>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alphaTwoCode"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="CA">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="limit"
              render={({ field }) => (
                <FormItem className="flex gap-2">
                  <Select
                    onValueChange={(value) => {
                      const parsed = parseInt(value, 10);
                      field.onChange(parsed);
                    }}
                    defaultValue={field.value.toString()}
                  >
                    <FormLabel>Items Per Page</FormLabel>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {pageSizes.map((pageSize) => (
                        <SelectItem key={pageSize} value={pageSize.toString()}>
                          {pageSize}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={schoolQuery.isFetching}>
            Search
          </Button>
          <SchoolList schools={schools}></SchoolList>
          <FormField
            control={form.control}
            name="page"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Pagination>
                    <PaginationContent>
                      {field.value > 1 && (
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => {
                              field.onChange(field.value - 1);
                              void schoolQuery.refetch();
                              window.scrollTo({ top: 0 });
                            }}
                          />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink>{field.value}</PaginationLink>
                      </PaginationItem>
                      {field.value < pages && (
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => {
                              field.onChange(field.value + 1);
                              void schoolQuery.refetch();
                              window.scrollTo({ top: 0 });
                            }}
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

export function SchoolList({ schools }: { schools: School[] | undefined }) {
  if (!schools) {
    return <p>No schools found.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {schools.map((school) => {
        return <SchoolCard key={school.publicId} {...school}></SchoolCard>;
      })}
    </div>
  );
}

export function SchoolCard({ name, country, stateOrProvince }: School) {
  // TODO: Add button to enroll the user in the school
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {stateOrProvince ? `${stateOrProvince}, ` : ""}
          {country}
        </CardDescription>
        <CardAction>Enroll</CardAction>
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
