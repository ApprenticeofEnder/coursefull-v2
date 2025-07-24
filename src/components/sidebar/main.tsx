"use client";

import type { Session } from "next-auth";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";

import { NavUser } from "./nav-user";
import { SchoolSwitcher } from "./school-switcher";

type SidebarProps = React.ComponentProps<typeof Sidebar> & {
  session: Session;
};

export function AppSidebar({ ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SchoolSwitcher schools={[]} />
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={props.session.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
