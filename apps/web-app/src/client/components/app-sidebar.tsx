"use client";

import * as React from "react";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Calendar,
  Clock,
  CreditCard,
  LayoutDashboard,
  MapPin,
  Settings,
  Sparkles,
  UserCheck,
  UserCog,
} from "lucide-react";

import { NavMain } from "@/client/components/nav-main";
import { NavUser } from "@/client/components/nav-user";
import { LanguageSelector } from "@/client/components/language-selector";
import { BusinessSwitcher } from "@/client/components/business-switcher";
import { useTranslation } from "@/client/i18n";
import { useAuth, useBusiness } from "@/client/contexts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/client/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { currentBusiness } = useBusiness();

  // Check if user is superadmin
  const isSuperAdmin = user?.type === "superadmin";

  const navSections = [
    // SuperAdmin Section - Only visible for superadmin users
    ...(isSuperAdmin
      ? [
          {
            title: "SuperAdmin",
            items: [
              {
                id: "users",
                title: t.navigation.users,
                url: "/users",
                icon: UserCog,
              },
              {
                id: "business",
                title: t.navigation.business,
                url: "/business",
                icon: Building2,
              },
            ],
          },
        ]
      : []),
    // Platform Section - Visible for all users
    {
      title: t.common.platform,
      items: [
        {
          id: "dashboard",
          title: t.navigation.dashboard,
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          id: "employees",
          title: t.navigation.employees,
          url: "/employees",
          icon: BriefcaseBusiness,
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
          icon: Sparkles,
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
      ],
    },
  ];

  // Prepare user data for NavUser component
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : "User",
    email: user?.email || "",
    avatar: user?.pictureFullPath || "",
  };

  // Determine if navigation should be disabled
  // Navigation is disabled when there's no current business AND user is not a superadmin
  const isNavDisabled = !currentBusiness && !isSuperAdmin;

  return (
    <Sidebar variant="inset" collapsible="icon" {...props}>
      <SidebarHeader>
        <BusinessSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={navSections} disabled={isNavDisabled} />
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelector />
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
