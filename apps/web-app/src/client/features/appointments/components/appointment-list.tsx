"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MoreHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/client/components/ui/table";
import { useTranslation } from "@/client/i18n";
import { useBusiness } from "@/client/contexts/business-context";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { useTrpc } from "@/client/lib/trpc";
import { formatInTz } from "@/client/lib/timezone-utils";
import {
  AppointmentFilters,
  type AppointmentFiltersValue,
} from "./appointment-filters";
import type { Appointment as AppointmentEntity } from "@/server/core/domain/entities/Appointment";

const PAGE_SIZE = 20;

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  confirmed: "outline",
  scheduled: "secondary",
  cancelled: "destructive",
};

export function AppointmentList() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AppointmentFiltersValue>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleFiltersChange = useCallback(
    (newFilters: AppointmentFiltersValue, hasActive: boolean) => {
      setFilters(newFilters);
      setHasActiveFilters(hasActive);
      setPage(1);
    },
    []
  );

  const { data, isLoading } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        filters: Object.keys(filters).length ? filters : undefined,
        pagination: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
      },
      { enabled: !!currentBusiness?.id }
    );

  const appointments = data?.appointments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Client-side search on loaded page
  const filtered = useMemo(() => {
    if (!search) return appointments;
    const q = search.toLowerCase();
    return appointments.filter((apt: AppointmentEntity) => {
      const client = apt.customer
        ? `${apt.customer.firstName} ${apt.customer.lastName ?? ""}`.toLowerCase()
        : "";
      const service = apt.service?.name?.toLowerCase() ?? "";
      const employee = apt.providerBusinessUser?.user
        ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName ?? ""}`.toLowerCase()
        : "";
      return client.includes(q) || service.includes(q) || employee.includes(q);
    });
  }, [appointments, search]);

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Selecciona un negocio</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters bar */}
      <div className="flex flex-wrap gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente, servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0"
              onClick={() => setSearch("")}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <AppointmentFilters onChange={handleFiltersChange} />
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        {total} {total === 1 ? "cita" : "citas"}
        {hasActiveFilters && " (filtradas)"}
      </p>

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.pages.clients.name}</TableHead>
              <TableHead>Servicio</TableHead>
              <TableHead>Empleado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Hora</TableHead>
              <TableHead>{t.pages.payments.status}</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron citas
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((apt: AppointmentEntity) => {
                const clientName = apt.customer
                  ? `${apt.customer.firstName} ${apt.customer.lastName ?? ""}`.trim()
                  : "—";
                const employee = apt.providerBusinessUser?.user
                  ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName ?? ""}`.trim()
                  : "—";
                return (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">{clientName}</TableCell>
                    <TableCell>{apt.service?.name ?? "—"}</TableCell>
                    <TableCell>{employee}</TableCell>
                    <TableCell>
                      {formatInTz(
                        new Date(apt.startTime),
                        timezone,
                        "dd MMM yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      {formatInTz(new Date(apt.startTime), timezone, "h:mm a")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[apt.status] ?? "outline"}
                        className="text-xs"
                      >
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Página {page} de {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
