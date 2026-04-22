"use client";

import React from "react";
import { SidebarInset, SidebarProvider } from "@/client/components/ui/sidebar";
import { AppSidebar } from "@/client/components/app-sidebar";
import { AppHeader } from "@/client/components/app-header";
import { PrivateFooter } from "@/client/components/private-footer";
import { ProtectedRoute } from "@/client/components/protected-route";
import { BusinessTimezoneProvider } from "@/client/contexts/business-timezone-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <BusinessTimezoneProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex min-h-screen flex-col">
              <AppHeader />
              <div className="flex-1">{children}</div>
              <PrivateFooter />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </BusinessTimezoneProvider>
    </ProtectedRoute>
  );
}
