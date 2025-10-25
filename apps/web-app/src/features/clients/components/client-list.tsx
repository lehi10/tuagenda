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

interface Client {
  id: string
  name: string
  email: string
  phone: string
  appointments: number
  lastVisit: string
  status: "active" | "inactive"
}

export function ClientList() {
  const { t } = useTranslation()

  const clients: Client[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      appointments: 12,
      lastVisit: "2024-10-20",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "(555) 987-6543",
      appointments: 8,
      lastVisit: "2024-10-22",
      status: "active",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob@example.com",
      phone: "(555) 456-7890",
      appointments: 5,
      lastVisit: "2024-09-15",
      status: "inactive",
    },
  ]

  const columns = [
    { header: t.pages.clients.name, accessor: "name" as const },
    { header: t.pages.clients.email, accessor: "email" as const },
    { header: t.pages.clients.phone, accessor: "phone" as const },
    { header: "Appointments", accessor: "appointments" as const },
    { header: "Last Visit", accessor: "lastVisit" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Client) => (
        <Badge variant={item.status === "active" ? "default" : "outline"}>
          {item.status}
        </Badge>
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
              {t.common.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return <DataTable data={clients} columns={columns} />
}
