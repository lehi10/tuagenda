"use client";

import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableWithFilters } from "@/components/shared/data-table-with-filters";
import { useTranslation } from "@/i18n";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  status: "active" | "inactive";
}

export function EmployeeList() {
  const { t } = useTranslation();

  const employees: Employee[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      role: "Stylist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      status: "active",
    },
    {
      id: "2",
      name: "Mike Brown",
      email: "mike@example.com",
      role: "Barber",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
      status: "active",
    },
    {
      id: "3",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "Nail Technician",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      status: "inactive",
    },
    {
      id: "4",
      name: "Robert Wilson",
      email: "robert@example.com",
      role: "Massage Therapist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
      status: "active",
    },
    {
      id: "5",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      role: "Stylist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
      status: "active",
    },
    {
      id: "6",
      name: "Tom Harris",
      email: "tom@example.com",
      role: "Barber",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tom",
      status: "inactive",
    },
    {
      id: "7",
      name: "Amy Chen",
      email: "amy@example.com",
      role: "Nail Technician",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amy",
      status: "active",
    },
    {
      id: "8",
      name: "David Martinez",
      email: "david@example.com",
      role: "Massage Therapist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      status: "active",
    },
    {
      id: "9",
      name: "Emma Taylor",
      email: "emma@example.com",
      role: "Stylist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      status: "active",
    },
    {
      id: "10",
      name: "James Lee",
      email: "james@example.com",
      role: "Barber",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
      status: "active",
    },
    {
      id: "11",
      name: "Sophia Garcia",
      email: "sophia@example.com",
      role: "Nail Technician",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
      status: "inactive",
    },
    {
      id: "12",
      name: "Daniel Kim",
      email: "daniel@example.com",
      role: "Massage Therapist",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel",
      status: "active",
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const columns = [
    {
      header: t.pages.clients.name,
      accessor: (item: Employee) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.avatar} alt={item.name} />
            <AvatarFallback>{getInitials(item.name)}</AvatarFallback>
          </Avatar>
          <span className="font-medium">{item.name}</span>
        </div>
      ),
    },
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
  ];

  return (
    <DataTableWithFilters
      data={employees}
      columns={columns}
      searchableColumns={["name", "email"]}
      filters={[
        {
          placeholder: "Filter by status",
          accessor: "status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
        {
          placeholder: "Filter by role",
          accessor: "role",
          options: [
            { value: "Stylist", label: "Stylist" },
            { value: "Barber", label: "Barber" },
            { value: "Nail Technician", label: "Nail Technician" },
            { value: "Massage Therapist", label: "Massage Therapist" },
          ],
        },
      ]}
      pageSize={5}
    />
  );
}
