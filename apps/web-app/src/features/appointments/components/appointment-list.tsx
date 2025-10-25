"use client"

import { MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableWithFilters } from "@/components/shared/data-table-with-filters"
import { useTranslation } from "@/i18n"

interface Appointment {
  id: string
  client: string
  service: string
  employee: string
  date: string
  time: string
  status: "pending" | "completed" | "cancelled"
}

export function AppointmentList() {
  const { t } = useTranslation()

  const appointments: Appointment[] = [
    {
      id: "1",
      client: "John Doe",
      service: "Haircut",
      employee: "Sarah Johnson",
      date: "2024-10-24",
      time: "10:00 AM",
      status: "pending",
    },
    {
      id: "2",
      client: "Jane Smith",
      service: "Manicure",
      employee: "Emily Davis",
      date: "2024-10-24",
      time: "11:30 AM",
      status: "pending",
    },
    {
      id: "3",
      client: "Bob Wilson",
      service: "Massage",
      employee: "Mike Brown",
      date: "2024-10-23",
      time: "2:00 PM",
      status: "completed",
    },
    {
      id: "4",
      client: "Alice Brown",
      service: "Facial",
      employee: "Lisa Anderson",
      date: "2024-10-25",
      time: "9:00 AM",
      status: "pending",
    },
    {
      id: "5",
      client: "Charlie Green",
      service: "Haircut",
      employee: "Tom Harris",
      date: "2024-10-22",
      time: "3:00 PM",
      status: "completed",
    },
    {
      id: "6",
      client: "Diana Prince",
      service: "Manicure",
      employee: "Amy Chen",
      date: "2024-10-21",
      time: "1:00 PM",
      status: "cancelled",
    },
    {
      id: "7",
      client: "Ethan Hunt",
      service: "Massage",
      employee: "David Martinez",
      date: "2024-10-25",
      time: "11:00 AM",
      status: "pending",
    },
    {
      id: "8",
      client: "Fiona White",
      service: "Haircut",
      employee: "Sarah Johnson",
      date: "2024-10-26",
      time: "2:00 PM",
      status: "pending",
    },
    {
      id: "9",
      client: "George Clark",
      service: "Facial",
      employee: "Emma Taylor",
      date: "2024-10-20",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: "10",
      client: "Helen Moore",
      service: "Manicure",
      employee: "Emily Davis",
      date: "2024-10-19",
      time: "4:00 PM",
      status: "completed",
    },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

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
  ]

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
            { value: "pending", label: "Pending" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
          ],
        },
        {
          placeholder: "Filter by service",
          accessor: "service",
          options: [
            { value: "Haircut", label: "Haircut" },
            { value: "Manicure", label: "Manicure" },
            { value: "Massage", label: "Massage" },
            { value: "Facial", label: "Facial" },
          ],
        },
      ]}
      pageSize={7}
    />
  )
}
