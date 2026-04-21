"use client";

import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { DataTableWithFilters } from "@/client/components/shared/data-table-with-filters";
import { useTranslation } from "@/client/i18n";
import { useBusiness } from "@/client/contexts/business-context";
import { useTrpc } from "@/client/lib/trpc";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { formatInTz } from "@/client/lib/timezone-utils";
import type { Appointment as AppointmentEntity } from "@/server/core/domain/entities/Appointment";

interface Appointment {
  [key: string]: unknown;
  id: string;
  client: string;
  service: string;
  employee: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

export function AppointmentList() {
  const { t } = useTranslation();
  const { timezone } = useBusinessTimezone();
  const { currentBusiness } = useBusiness();

  // Fetch appointments from tRPC
  const { data, isLoading } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        businessId: currentBusiness?.id || "",
        pagination: {
          limit: 10,
          offset: 0,
        },
      },
      {
        enabled: !!currentBusiness?.id,
      }
    );

  // Transform API data to table format
  const appointments: Appointment[] =
    data?.appointments?.map((apt: AppointmentEntity) => ({
      id: apt.id!,
      client: apt.customer
        ? `${apt.customer.firstName} ${apt.customer.lastName || ""}`.trim()
        : "N/A",
      service: apt.service?.name || "N/A",
      employee: apt.providerBusinessUser?.user
        ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName || ""}`.trim()
        : "N/A",
      date: formatInTz(new Date(apt.startTime), timezone, "yyyy-MM-dd"),
      time: formatInTz(new Date(apt.startTime), timezone, "h:mm a"),
      status: apt.status,
    })) || [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns = [
    { header: t.pages.clients.name, accessor: "client" as const },
    { header: "Service", accessor: "service" as const },
    { header: "Employee", accessor: "employee" as const },
    { header: t.pages.payments.date, accessor: "date" as const },
    { header: "Time", accessor: "time" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Appointment) => (
        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
      ),
    },
    {
      header: "",
      accessor: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t.common.edit}</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              {t.common.cancel}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading appointments...</p>
      </div>
    );
  }

  // No business selected
  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Please select a business</p>
      </div>
    );
  }

  return (
    <DataTableWithFilters
      data={appointments}
      columns={columns}
      searchableColumns={["client", "employee", "service"]}
      filters={[
        {
          placeholder: "Filter by status",
          accessor: "status",
          options: [
            { value: "scheduled", label: "Scheduled" },
            { value: "confirmed", label: "Confirmed" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
      ]}
      pageSize={10}
    />
  );
}
