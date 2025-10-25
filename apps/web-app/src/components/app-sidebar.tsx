"use client"

import * as React from "react"
import {
  Bell,
  Briefcase,
  Calendar,
  Clock,
  Command,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Settings,
  UserCheck,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { LanguageSelector } from "@/components/language-selector"
import { useTranslation } from "@/i18n"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()

  const navMain = [
    {
      title: t.navigation.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.navigation.employees,
      url: "/employees",
      icon: Users,
    },
    {
      title: t.navigation.calendar,
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: t.navigation.appointments,
      url: "/appointments",
      icon: Clock,
    },
    {
      title: t.navigation.services,
      url: "/services",
      icon: Briefcase,
    },
    {
      title: t.navigation.locations,
      url: "/locations",
      icon: MapPin,
    },
    {
      title: t.navigation.clients,
      url: "/clients",
      icon: UserCheck,
    },
    {
      title: t.navigation.payments,
      url: "/payments",
      icon: CreditCard,
    },
    {
      title: t.navigation.notifications,
      url: "/notifications",
      icon: Bell,
    },
    {
      title: t.navigation.settings,
      url: "/settings",
      icon: Settings,
    },
  ]

  const user = {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1">
          <LanguageSelector />
        </div>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
