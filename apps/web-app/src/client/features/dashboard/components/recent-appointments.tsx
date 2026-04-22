"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Avatar, AvatarFallback } from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { useTrpc } from "@/client/lib/trpc";
import { useBusiness } from "@/client/contexts/business-context";

const ITEMS_PER_PAGE = 8;

type DisplayStatus = "pending" | "completed" | "cancelled";

function toDisplayStatus(
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
): DisplayStatus {
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  return "pending";
}

function getStatusConfig(status: DisplayStatus) {
  switch (status) {
    case "completed":
      return { icon: CheckCircle2, variant: "default" as const, label: "Completed" };
    case "pending":
      return { icon: AlertCircle, variant: "secondary" as const, label: "Pending" };
    case "cancelled":
      return { icon: XCircle, variant: "destructive" as const, label: "Cancelled" };
  }
}

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

export function RecentAppointments() {
  const { currentBusiness } = useBusiness();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");

  const { data, isLoading } = useTrpc.appointment.getBusinessAppointments.useQuery(
    { businessId: currentBusiness?.id ?? "", pagination: { limit: 100, offset: 0 } },
    { enabled: !!currentBusiness?.id }
  );

  const appointments = useMemo(() => {
    return (data?.appointments ?? []).map((apt) => {
      const clientName = apt.customer
        ? `${apt.customer.firstName} ${apt.customer.lastName ?? ""}`.trim()
        : "Guest";
      const employeeName = apt.providerBusinessUser
        ? apt.providerBusinessUser.displayName ??
          `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName ?? ""}`.trim()
        : "—";
      const startTime = new Date(apt.startTime);
      const dateStr = startTime.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = startTime.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
      const durationMinutes = apt.service?.durationMinutes ?? 0;
      const durationStr =
        durationMinutes >= 60
          ? `${Math.floor(durationMinutes / 60)}h${durationMinutes % 60 > 0 ? ` ${durationMinutes % 60}m` : ""}`
          : `${durationMinutes}m`;
      return {
        id: apt.id ?? "",
        client: clientName,
        service: apt.service?.name ?? "—",
        employee: employeeName,
        date: dateStr,
        time: timeStr,
        duration: durationStr,
        status: toDisplayStatus(apt.status),
        price: apt.service?.price as number | undefined,
      };
    });
  }, [data]);

  const uniqueServices = useMemo(
    () => Array.from(new Set(appointments.map((a) => a.service))).filter((s) => s !== "—"),
    [appointments]
  );

  const filtered = useMemo(
    () =>
      appointments.filter((apt) => {
        const q = searchQuery.toLowerCase();
        return (
          (!q || apt.client.toLowerCase().includes(q) || apt.service.toLowerCase().includes(q)) &&
          (statusFilter === "all" || apt.status === statusFilter) &&
          (serviceFilter === "all" || apt.service === serviceFilter)
        );
      }),
    [appointments, searchQuery, statusFilter, serviceFilter]
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageItems = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (v: string) => { setSearchQuery(v); setCurrentPage(1); };
  const handleStatusChange = (v: string) => { setStatusFilter(v); setCurrentPage(1); };
  const handleServiceChange = (v: string) => { setServiceFilter(v); setCurrentPage(1); };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4" />
            Recent Appointments
            {!isLoading && (
              <span className="text-xs font-normal text-muted-foreground">
                ({filtered.length})
              </span>
            )}
          </CardTitle>

          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-8 h-7 text-xs w-40"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-7 text-xs w-[110px]">
                <Filter className="h-3 w-3 mr-1" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={serviceFilter} onValueChange={handleServiceChange}>
              <SelectTrigger className="h-7 text-xs w-[110px]">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {uniqueServices.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6 text-xs w-[180px]">Client</TableHead>
              <TableHead className="text-xs">Service</TableHead>
              <TableHead className="text-xs hidden md:table-cell">Professional</TableHead>
              <TableHead className="text-xs hidden sm:table-cell">Date & Time</TableHead>
              <TableHead className="text-xs hidden sm:table-cell text-right">Duration</TableHead>
              <TableHead className="text-xs text-right">Price</TableHead>
              <TableHead className="text-xs pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {[180, 120, 120, 100, 60, 60, 90].map((w, j) => (
                    <TableCell key={j} className={j === 0 ? "pl-6" : j === 6 ? "pr-6" : ""}>
                      <div
                        className="h-4 animate-pulse bg-muted rounded"
                        style={{ width: w }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!isLoading && pageItems.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={7} className="text-center py-10 text-sm text-muted-foreground">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              pageItems.map((apt) => {
                const cfg = getStatusConfig(apt.status);
                const StatusIcon = cfg.icon;
                return (
                  <TableRow key={apt.id}>
                    {/* Client */}
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 flex-shrink-0">
                          <AvatarFallback className="text-[10px] font-semibold">
                            {getInitials(apt.client)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate max-w-[120px]">
                          {apt.client}
                        </span>
                      </div>
                    </TableCell>

                    {/* Service */}
                    <TableCell>
                      <span className="text-sm">{apt.service}</span>
                    </TableCell>

                    {/* Professional */}
                    <TableCell className="hidden md:table-cell">
                      <span className="text-sm text-muted-foreground">{apt.employee}</span>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell className="hidden sm:table-cell">
                      <div className="text-xs">
                        <p className="font-medium">{apt.date}</p>
                        <p className="text-muted-foreground">{apt.time}</p>
                      </div>
                    </TableCell>

                    {/* Duration */}
                    <TableCell className="hidden sm:table-cell text-right">
                      <span className="text-xs text-muted-foreground">{apt.duration}</span>
                    </TableCell>

                    {/* Price */}
                    <TableCell className="text-right">
                      {apt.price !== undefined ? (
                        <span className="text-sm font-semibold">
                          ${Number(apt.price).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="pr-6 text-right">
                      <Badge variant={cfg.variant} className="gap-1 text-[10px] px-1.5 py-0">
                        <StatusIcon className="h-2.5 w-2.5" />
                        {cfg.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t">
            <span className="text-xs text-muted-foreground">
              {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="h-7 w-7 p-0"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) page = i + 1;
                else if (currentPage <= 3) page = i + 1;
                else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                else page = currentPage - 2 + i;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="h-7 w-7 p-0 text-xs"
                  >
                    {page}
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-7 w-7 p-0"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
