"use client";

import { PublicHeader } from "@/client/components/public-header";
import { PublicFooter } from "@/client/components/public-footer";
import { BookingHeader } from "@/client/components/booking/shared/booking-header";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <BookingHeader />
      {children}
      <PublicFooter />
    </div>
  );
}
