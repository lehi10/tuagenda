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
  UsersRound,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { LanguageSelector } from "@/components/language-selector";
import { BusinessSwitcher } from "@/components/business-switcher";
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
      id: "dashboard",
      title: t.navigation.dashboard,
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "business",
      title: t.navigation.business,
      url: "/business",
      icon: Building2,
    },
    {
      id: "employees",
      title: t.navigation.employees,
      url: "/employees",
      icon: Users,
    },
    {
      id: "users",
      title: t.navigation.users,
      url: "/users",
      icon: UsersRound,
    },
    {
      id: "calendar",
      title: t.navigation.calendar,
      url: "/calendar",
      icon: Calendar,
    },
    {
      id: "appointments",
      title: t.navigation.appointments,
      url: "/appointments",
      icon: Clock,
    },
    {
      id: "services",
      title: t.navigation.services,
      url: "/services",
      icon: Briefcase,
    },
    {
      id: "locations",
      title: t.navigation.locations,
      url: "/locations",
      icon: MapPin,
    },
    {
      id: "clients",
      title: t.navigation.clients,
      url: "/clients",
      icon: UserCheck,
    },
    {
      id: "payments",
      title: t.navigation.payments,
      url: "/payments",
      icon: CreditCard,
    },
    {
      id: "notifications",
      title: t.navigation.notifications,
      url: "/notifications",
      icon: Bell,
    },
    {
      id: "settings",
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
        <BusinessSwitcher />
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
