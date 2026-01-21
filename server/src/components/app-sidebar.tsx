"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDevices } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient, getSession, useSession } from "@/server/better-auth/client"
import { TeamSwitcher } from "./team-switcher"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Devices",
      url: "/dashboard/device",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: IconChartBar,
    },
    {
      title: "Api Keys",
      url: "/dashboard/apikeys",
      icon: IconReport,
    }
  ],
  teams: [
    { name: "Personal Team", logo: IconInnerShadowTop, plan: "Pro Plan" },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = useSession()
  const orgs = authClient.useListOrganizations();
  console.log("Orgs in sidebar:", orgs.data);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={orgs.data?.map(org => ({ name: org.name, logo: IconInnerShadowTop, plan: "None" })) ?? [{ name: "Personal Team", logo: IconInnerShadowTop, plan: "Pro Plan" }]} />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDevices />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ name: user.data?.user.name ?? "", email: user.data?.user.email ?? "", avatar: user.data?.user.image ?? "" }} />
      </SidebarFooter>
    </Sidebar>
  )
}
