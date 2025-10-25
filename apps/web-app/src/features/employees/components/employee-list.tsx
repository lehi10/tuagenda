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

interface Employee {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
}

export function EmployeeList() {
  const { t } = useTranslation()

  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Stylist",
      status: "active",
    },
    {
      id: "2",
      name: "Mike Brown",
      email: "mike@example.com",
      role: "Barber",
      status: "active",
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Nail Technician",
      status: "inactive",
    },
  ]

  const columns = [
    { header: t.pages.clients.name, accessor: "name" as const },
    { header: t.pages.clients.email, accessor: "email" as const },
    { header: "Role", accessor: "role" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Employee) => (
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

  return <DataTable data={employees} columns={columns} />
}
