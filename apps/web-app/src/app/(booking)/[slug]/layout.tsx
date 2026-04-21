"use client";

import { PublicFooter } from "@/client/components/public-footer";
import { BookingHeader } from "@/client/components/booking/shared/booking-header";
import { UserTimezoneProvider } from "@/client/contexts/user-timezone-context";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserTimezoneProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <BookingHeader />
        {children}
        <PublicFooter />
      </div>
    </UserTimezoneProvider>
  );
}
