"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MoreHorizontal,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  ThumbsUp,
} from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { formatCurrency } from "@/client/lib/currency-utils";
import {
  AppointmentFilters,
  type AppointmentFiltersValue,
} from "./appointment-filters";
import { AppointmentDetailSheet } from "./appointment-detail-sheet";
import type {
  Appointment as AppointmentEntity,
  AppointmentStatus,
} from "@/server/core/domain/entities/Appointment";

const PAGE_SIZE = 20;

const STATUS_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  confirmed: "outline",
  scheduled: "secondary",
  cancelled: "destructive",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_TRANSITIONS: Record<
  AppointmentStatus,
  { status: AppointmentStatus; label: string; icon: React.ElementType }[]
> = {
  scheduled: [
    { status: "confirmed", label: "Confirmar", icon: ThumbsUp },
    { status: "cancelled", label: "Cancelar", icon: XCircle },
  ],
  confirmed: [
    { status: "completed", label: "Marcar completada", icon: CheckCircle2 },
    { status: "cancelled", label: "Cancelar", icon: XCircle },
  ],
  completed: [],
  cancelled: [{ status: "scheduled", label: "Reprogramar", icon: Clock }],
};

export function AppointmentList() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AppointmentFiltersValue>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Mock local status overrides
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, AppointmentStatus>
  >({});

  // Detail sheet state
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentEntity | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  // Merge mock overrides into appointments
  const appointmentsWithOverrides = useMemo(
    () =>
      appointments.map((apt: AppointmentEntity) => ({
        ...apt,
        status:
          apt.id && statusOverrides[apt.id]
            ? statusOverrides[apt.id]
            : apt.status,
      })),
    [appointments, statusOverrides]
  );

  // Client-side search on loaded page
  const filtered = useMemo(() => {
    if (!search) return appointmentsWithOverrides;
    const q = search.toLowerCase();
    return appointmentsWithOverrides.filter((apt: AppointmentEntity) => {
      const client = apt.customer
        ? `${apt.customer.firstName} ${apt.customer.lastName ?? ""}`.toLowerCase()
        : "";
      const service = apt.service?.name?.toLowerCase() ?? "";
      const employee = apt.providerBusinessUser?.user
        ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName ?? ""}`.toLowerCase()
        : "";
      return client.includes(q) || service.includes(q) || employee.includes(q);
    });
  }, [appointmentsWithOverrides, search]);

  const handleStatusChange = useCallback(
    (id: string, status: AppointmentStatus) => {
      setStatusOverrides((prev) => ({ ...prev, [id]: status }));
      // Update selected appointment in sheet if open
      setSelectedAppointment((prev) =>
        prev?.id === id ? { ...prev, status } : prev
      );
    },
    []
  );

  const handleOpenDetail = useCallback((apt: AppointmentEntity) => {
    setSelectedAppointment(apt);
    setSheetOpen(true);
  }, []);

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
              <TableHead>Fecha y hora</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>{t.pages.payments.status}</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
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
                const startDate = new Date(apt.startTime);
                const dateStr = formatInTz(startDate, timezone, "dd MMM yyyy");
                const timeStr = formatInTz(startDate, timezone, "h:mm a");
                const duration = apt.service?.durationMinutes
                  ? `${apt.service.durationMinutes} min`
                  : "—";
                const price =
                  apt.service?.price != null
                    ? formatCurrency(
                        apt.service.price,
                        currentBusiness?.currency ?? "USD"
                      )
                    : "—";
                const transitions = STATUS_TRANSITIONS[apt.status] ?? [];

                return (
                  <TableRow
                    key={apt.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleOpenDetail(apt)}
                  >
                    <TableCell className="font-medium">{clientName}</TableCell>
                    <TableCell>{apt.service?.name ?? "—"}</TableCell>
                    <TableCell>{employee}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{dateStr}</span>
                        <span className="text-xs text-muted-foreground">
                          {timeStr}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {duration}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      {price}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={STATUS_VARIANT[apt.status] ?? "outline"}
                        className="text-xs"
                      >
                        {STATUS_LABEL[apt.status] ?? apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenDetail(apt)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalle
                          </DropdownMenuItem>

                          {transitions.length > 0 && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                Cambiar estado
                              </DropdownMenuLabel>
                              {transitions.map(
                                ({ status, label, icon: Icon }) => (
                                  <DropdownMenuItem
                                    key={status}
                                    onClick={() =>
                                      apt.id &&
                                      handleStatusChange(apt.id, status)
                                    }
                                    className={
                                      status === "cancelled"
                                        ? "text-destructive focus:text-destructive"
                                        : ""
                                    }
                                  >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {label}
                                  </DropdownMenuItem>
                                )
                              )}
                            </>
                          )}
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

      {/* Detail sheet */}
      <AppointmentDetailSheet
        appointment={selectedAppointment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
