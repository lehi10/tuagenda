"use client";

import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { StatCard } from "@/client/components/shared/stat-card";
import { useTranslation } from "@/client/i18n";
import { useBusiness } from "@/client/contexts/business-context";
import { useTrpc } from "@/client/lib/trpc";

export function AppointmentStats() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();

  // Calculate date ranges
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOf30Days = new Date(startOfToday);
  endOf30Days.setDate(endOf30Days.getDate() + 30);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Query for all appointments (total)
  const { data: totalData } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        businessId: currentBusiness?.id || "",
        pagination: { limit: 1, offset: 0 },
      },
      { enabled: !!currentBusiness?.id }
    );

  // Query for upcoming appointments (next 30 days, scheduled or confirmed)
  const { data: upcomingData } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        businessId: currentBusiness?.id || "",
        filters: {
          status: ["scheduled", "confirmed"],
          startAfter: startOfToday.toISOString(),
          startBefore: endOf30Days.toISOString(),
        },
        pagination: { limit: 1, offset: 0 },
      },
      { enabled: !!currentBusiness?.id }
    );

  // Query for completed appointments this month
  const { data: completedData } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        businessId: currentBusiness?.id || "",
        filters: {
          status: "completed",
          startAfter: startOfMonth.toISOString(),
          startBefore: endOfMonth.toISOString(),
        },
        pagination: { limit: 1, offset: 0 },
      },
      { enabled: !!currentBusiness?.id }
    );

  // Query for cancelled appointments this month
  const { data: cancelledData } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        businessId: currentBusiness?.id || "",
        filters: {
          status: "cancelled",
          startAfter: startOfMonth.toISOString(),
          startBefore: endOfMonth.toISOString(),
        },
        pagination: { limit: 1, offset: 0 },
      },
      { enabled: !!currentBusiness?.id }
    );

  const stats = [
    {
      title: "Total",
      value: String(totalData?.total || 0),
      icon: Calendar,
      description: "All appointments",
    },
    {
      title: t.pages.appointments.upcoming,
      value: String(upcomingData?.total || 0),
      icon: Clock,
      description: "Next 30 days",
    },
    {
      title: t.pages.payments.completed,
      value: String(completedData?.total || 0),
      icon: CheckCircle,
      description: "This month",
    },
    {
      title: "Cancelled",
      value: String(cancelledData?.total || 0),
      icon: XCircle,
      description: "This month",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
