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

interface Service {
  id: string
  name: string
  duration: string
  price: string
  category: string
  active: boolean
}

export function ServiceList() {
  const { t } = useTranslation()

  const services: Service[] = [
    {
      id: "1",
      name: "Haircut",
      duration: "30 min",
      price: "$25",
      category: "Hair",
      active: true,
    },
    {
      id: "2",
      name: "Manicure",
      duration: "45 min",
      price: "$30",
      category: "Nails",
      active: true,
    },
    {
      id: "3",
      name: "Massage",
      duration: "60 min",
      price: "$60",
      category: "Spa",
      active: true,
    },
    {
      id: "4",
      name: "Facial",
      duration: "50 min",
      price: "$45",
      category: "Spa",
      active: false,
    },
  ]

  const columns = [
    { header: t.pages.services.serviceName, accessor: "name" as const },
    { header: "Category", accessor: "category" as const },
    { header: t.pages.services.duration, accessor: "duration" as const },
    { header: t.pages.services.price, accessor: "price" as const },
    {
      header: t.pages.payments.status,
      accessor: (item: Service) => (
        <Badge variant={item.active ? "default" : "outline"}>
          {item.active ? "Active" : "Inactive"}
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

  return <DataTable data={services} columns={columns} />
}
