"use client";

import {
  Fallback as AvatarFallbackBase,
  Image as AvatarImageBase,
  Root as AvatarRootBase,
} from "@radix-ui/react-avatar";
import { type ComponentProps } from "react";

import { cn } from "~/lib/utils";

function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarRootBase>) {
  return (
    <AvatarRootBase
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarImageBase>) {
  return (
    <AvatarImageBase
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarFallbackBase>) {
  return (
    <AvatarFallbackBase
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
