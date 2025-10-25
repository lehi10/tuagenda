"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { I18nProvider } from "@/i18n"
import { OrganizationProvider } from "@/contexts/organization-context"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <OrganizationProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </OrganizationProvider>
    </I18nProvider>
  )
}
