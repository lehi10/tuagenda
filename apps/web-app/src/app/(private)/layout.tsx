"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { OrganizationProvider } from "@/contexts/organization-context"
import { PrivateFooter } from "@/components/private-footer"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrganizationProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
            <PrivateFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </OrganizationProvider>
  )
}
