"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";

interface Appointment {
  id: string;
  client: string;
  service: string;
  employee: string;
  date: string;
  time: string;
  duration: string;
  status: "pending" | "completed" | "cancelled";
  price?: number;
}

export function RecentAppointments() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const itemsPerPage = 5;

  const appointments: Appointment[] = [
    {
      id: "1",
      client: "John Doe",
      service: "Haircut",
      employee: "Sarah Johnson",
      date: "2024-10-24",
      time: "10:00 AM",
      duration: "30 min",
      status: "completed",
      price: 45,
    },
    {
      id: "2",
      client: "Jane Smith",
      service: "Manicure",
      employee: "Emily Davis",
      date: "2024-10-24",
      time: "11:30 AM",
      duration: "45 min",
      status: "pending",
      price: 35,
    },
    {
      id: "3",
      client: "Bob Johnson",
      service: "Massage",
      employee: "Mike Chen",
      date: "2024-10-23",
      time: "2:00 PM",
      duration: "60 min",
      status: "completed",
      price: 80,
    },
    {
      id: "4",
      client: "Alice Williams",
      service: "Coloring",
      employee: "Sarah Johnson",
      date: "2024-10-23",
      time: "9:00 AM",
      duration: "90 min",
      status: "completed",
      price: 120,
    },
    {
      id: "5",
      client: "Charlie Brown",
      service: "Haircut",
      employee: "James Wilson",
      date: "2024-10-22",
      time: "3:30 PM",
      duration: "30 min",
      status: "cancelled",
      price: 45,
    },
    {
      id: "6",
      client: "Diana Prince",
      service: "Spa Treatment",
      employee: "Emily Davis",
      date: "2024-10-22",
      time: "1:00 PM",
      duration: "120 min",
      status: "completed",
      price: 150,
    },
    {
      id: "7",
      client: "Erik Mason",
      service: "Haircut",
      employee: "Mike Chen",
      date: "2024-10-21",
      time: "4:00 PM",
      duration: "30 min",
      status: "completed",
      price: 45,
    },
    {
      id: "8",
      client: "Fiona Green",
      service: "Manicure",
      employee: "Sarah Johnson",
      date: "2024-10-21",
      time: "2:30 PM",
      duration: "45 min",
      status: "pending",
      price: 35,
    },
    {
      id: "9",
      client: "George Harris",
      service: "Massage",
      employee: "Emily Davis",
      date: "2024-10-21",
      time: "11:00 AM",
      duration: "60 min",
      status: "completed",
      price: 80,
    },
    {
      id: "10",
      client: "Hannah Lee",
      service: "Coloring",
      employee: "Sarah Johnson",
      date: "2024-10-20",
      time: "10:00 AM",
      duration: "90 min",
      status: "completed",
      price: 120,
    },
    {
      id: "11",
      client: "Ian Foster",
      service: "Haircut",
      employee: "James Wilson",
      date: "2024-10-20",
      time: "3:00 PM",
      duration: "30 min",
      status: "cancelled",
      price: 45,
    },
    {
      id: "12",
      client: "Julia Roberts",
      service: "Spa Treatment",
      employee: "Mike Chen",
      date: "2024-10-19",
      time: "1:30 PM",
      duration: "120 min",
      status: "completed",
      price: 150,
    },
  ];

  // Get unique services for filter
  const uniqueServices = useMemo(() => {
    return Array.from(new Set(appointments.map((app) => app.service)));
  }, [appointments]);

  // Filter appointments based on search and filters
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch =
        searchQuery === "" ||
        appointment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || appointment.status === statusFilter;

      const matchesService =
        serviceFilter === "all" || appointment.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [appointments, searchQuery, statusFilter, serviceFilter]);

  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAppointments = filteredAppointments.slice(startIndex, endIndex);

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleServiceFilterChange = (value: string) => {
    setServiceFilter(value);
    setCurrentPage(1);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle2,
          variant: "default" as const,
          color: "text-green-600 dark:text-green-400",
          bg: "bg-green-50 dark:bg-green-900/20",
          label: "Completed",
        };
      case "pending":
        return {
          icon: AlertCircle,
          variant: "secondary" as const,
          color: "text-amber-600 dark:text-amber-400",
          bg: "bg-amber-50 dark:bg-amber-900/20",
          label: "Pending",
        };
      case "cancelled":
        return {
          icon: XCircle,
          variant: "destructive" as const,
          color: "text-red-600 dark:text-red-400",
          bg: "bg-red-50 dark:bg-red-900/20",
          label: "Cancelled",
        };
      default:
        return {
          icon: AlertCircle,
          variant: "outline" as const,
          color: "text-gray-600 dark:text-gray-400",
          bg: "bg-gray-50 dark:bg-gray-900/20",
          label: status,
        };
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client or service..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={serviceFilter}
            onValueChange={handleServiceFilterChange}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Appointments List */}
        {currentAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No appointments found matching your filters.
          </div>
        ) : (
          <div className="space-y-3">
            {currentAppointments.map((appointment) => {
              const statusConfig = getStatusConfig(appointment.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:shadow-md transition-all"
                >
                  {/* Client Avatar */}
                  <Avatar className="h-12 w-12 border-2 border-primary/10">
                    <AvatarFallback className="text-sm font-semibold bg-primary/5">
                      {getInitials(appointment.client)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Client Info */}
                  <div
                    className="min-w-0 flex-shrink-0"
                    style={{ width: "140px" }}
                  >
                    <p className="font-semibold text-sm truncate">
                      {appointment.client}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>

                  {/* Service Badge */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 min-w-0 flex-shrink-0"
                    style={{ width: "180px" }}
                  >
                    <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900/30 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400"
                      >
                        <rect
                          width="20"
                          height="14"
                          x="2"
                          y="7"
                          rx="2"
                          ry="2"
                        />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 truncate">
                        {appointment.service}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-500">
                        {appointment.duration}
                      </p>
                    </div>
                  </div>

                  {/* Professional Badge */}
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-md bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 min-w-0 flex-shrink-0"
                    style={{ width: "180px" }}
                  >
                    <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900/30 flex-shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-purple-900 dark:text-purple-300 truncate">
                        {appointment.employee}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-500">
                        Professional
                      </p>
                    </div>
                  </div>

                  {/* Date (Hidden on mobile) */}
                  <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground min-w-0 flex-shrink-0">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{appointment.date}</span>
                  </div>

                  {/* Status and Price */}
                  <div className="flex flex-col items-end gap-2 ml-auto">
                    <Badge
                      variant={statusConfig.variant}
                      className="gap-1.5 whitespace-nowrap"
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusConfig.label}
                    </Badge>
                    {appointment.price && (
                      <span className="text-base font-bold text-primary">
                        ${appointment.price}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && currentAppointments.length > 0 && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-
              {Math.min(endIndex, filteredAppointments.length)} of{" "}
              {filteredAppointments.length}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
