"use client";

import * as React from "react";
import { Calendar, User } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { LanguageSelector } from "@/components/language-selector";
import { useAuth } from "@/contexts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function ClientSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const navMain = [
    {
      title: "Mis Citas",
      url: "/u/appointments",
      icon: Calendar,
    },
    {
      title: "Mi Perfil",
      url: "/u/profile",
      icon: User,
    },
  ];

  // Prepare user data for NavUser component
  const userData = {
    name: user ? `${user.firstName} ${user.lastName}`.trim() : "Cliente",
    email: user?.email || "",
    avatar: user?.pictureFullPath || "",
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
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
        </div>
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
