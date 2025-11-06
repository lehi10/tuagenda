"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/shared/data-table";
import { useTranslation } from "@/i18n";

interface Payment {
  id: string;
  client: string;
  service: string;
  amount: string;
  date: string;
  method: "card" | "cash" | "online";
  status: "pending" | "completed" | "failed";
}

export function PaymentList() {
  const { t } = useTranslation();

  const payments: Payment[] = [
    {
      id: "1",
      client: "John Doe",
      service: "Haircut",
      amount: "$25.00",
      date: "2024-10-24",
      method: "card",
      status: "completed",
    },
    {
      id: "2",
      client: "Jane Smith",
      service: "Manicure",
      amount: "$30.00",
      date: "2024-10-24",
      method: "cash",
      status: "completed",
    },
    {
      id: "3",
      client: "Bob Wilson",
      service: "Massage",
      amount: "$60.00",
      date: "2024-10-23",
      method: "online",
      status: "pending",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const columns = [
    { header: t.pages.clients.name, accessor: "client" as const },
    { header: "Service", accessor: "service" as const },
    { header: t.pages.payments.amount, accessor: "amount" as const },
    { header: t.pages.payments.date, accessor: "date" as const },
    { header: "Method", accessor: "method" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Payment) => (
        <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
      ),
    },
  ];

  return <DataTable data={payments} columns={columns} />;
}
