"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { useTranslation } from "@/i18n";

interface Appointment {
  id: string;
  client: string;
  service: string;
  date: string;
  time: string;
  status: "pending" | "completed" | "cancelled";
}

export function RecentAppointments() {
  const { t } = useTranslation();

  const appointments: Appointment[] = [
    {
      id: "1",
      client: "John Doe",
      service: "Haircut",
      date: "2024-10-24",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: "2",
      client: "Jane Smith",
      service: "Manicure",
      date: "2024-10-24",
      time: "11:30 AM",
      status: "pending",
    },
    {
      id: "3",
      client: "Bob Johnson",
      service: "Massage",
      date: "2024-10-23",
      time: "2:00 PM",
      status: "completed",
    },
  ];

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
    { header: t.pages.payments.date, accessor: "date" as const },
    { header: "Time", accessor: "time" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Appointment) => (
        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
      ),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={appointments} columns={columns} />
      </CardContent>
    </Card>
  );
}
