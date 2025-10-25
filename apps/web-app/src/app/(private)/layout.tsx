"use client"

import React from "react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { I18nProvider } from "@/i18n"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <I18nProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </I18nProvider>
  )
}
