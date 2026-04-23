"use client";

import * as React from "react";
import { Calendar, User } from "lucide-react";

import { NavMain } from "@/client/components/nav-main";
import { NavUser } from "@/client/components/nav-user";
import { LanguageSelector } from "@/client/components/language-selector";
import { useAuth } from "@/client/contexts";
import { useTranslation } from "@/client/i18n";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/client/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function ClientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const { t } = useTranslation();

  const navSections = [
    {
      title: t.common.client,
      items: [
        {
          id: "appointments",
          title: t.common.myAppointments,
          url: "/u/appointments",
          icon: Calendar,
        },
        {
          id: "profile",
          title: t.common.myProfile,
          url: "/u/profile",
          icon: User,
        },
      ],
    },
  ];

  // Prepare user data for NavUser component
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : t.common.client,
    email: user?.email || "",
    avatar: user?.pictureFullPath || "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex flex-col gap-1 px-4 py-2">
          <Link href="/u/appointments" className="flex items-center gap-2">
            <Image
              src="/icons/2_vertical_color.png"
              alt="TuAgenda"
              width={100}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground px-1">
            Portal del cliente
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain sections={navSections} />
      </SidebarContent>
      <SidebarFooter>
        <LanguageSelector />
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
