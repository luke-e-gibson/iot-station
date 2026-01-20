"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDevices() {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton asChild>
              <a suppressHydrationWarning={true} href={`/dashboard/device/${crypto.randomUUID()}`}>
                <IconDots />
                <span>Test Device</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>

      </SidebarMenu>
    </SidebarGroup>
  )
}
