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
import { DataTable } from "@/components/shared/data-table"
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

  return <DataTable data={appointments} columns={columns} />
}
