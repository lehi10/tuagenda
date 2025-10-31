"use client";

import * as React from "react";
import {
  Bell,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Settings,
  UserCheck,
  Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { LanguageSelector } from "@/components/language-selector";
import { OrganizationSwitcher } from "@/components/organization-switcher";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/contexts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user } = useAuth();

  const navMain = [
    {
      title: t.navigation.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: t.navigation.business,
      url: "/business",
      icon: Building2,
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
  ];

  // Prepare user data for NavUser component
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : "User",
    email: user?.email || "",
    avatar: user?.pictureFullPath || "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1">
          <LanguageSelector />
        </div>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
