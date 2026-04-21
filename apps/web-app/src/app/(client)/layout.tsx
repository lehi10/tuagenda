"use client";

import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/client/components/ui/sidebar";
import { ClientSidebar } from "@/client/components/client-sidebar";
import { ClientRoute } from "@/client/components/client-route";
import { Separator } from "@/client/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/client/components/ui/breadcrumb";
import { WaitlistBanner } from "@/client/components/waitlist-banner";
import { UserTimezoneProvider } from "@/client/contexts/user-timezone-context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClientRoute>
      <UserTimezoneProvider>
      <WaitlistBanner />
      <SidebarProvider>
        <ClientSidebar />
        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            {/* Mobile Header with Trigger */}
            <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
              <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage className="line-clamp-1">
                        <span className="text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          TuAgenda
                        </span>
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex-1">{children}</div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      </UserTimezoneProvider>
    </ClientRoute>
  );
}
