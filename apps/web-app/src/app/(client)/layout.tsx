"use client";

import React from "react";
import { ClientRoute } from "@/components/client-route";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientRoute>{children}</ClientRoute>;
}
