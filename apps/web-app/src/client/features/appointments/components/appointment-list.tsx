"use client";

import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
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
  ChevronUp,
  Loader2,
  ChevronDown,
  ChevronsUpDown,
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

const STATUS_VARIANT: Record<AppointmentStatus, string> = {
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  scheduled:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

type AppointmentActionKey =
  | "confirm"
  | "cancel"
  | "markCompleted"
  | "reschedule";

const STATUS_TRANSITIONS_CONFIG: Record<
  AppointmentStatus,
  {
    status: AppointmentStatus;
    actionKey: AppointmentActionKey;
    icon: React.ElementType;
    destructive?: boolean;
  }[]
> = {
  scheduled: [
    { status: "confirmed", actionKey: "confirm", icon: ThumbsUp },
    {
      status: "cancelled",
      actionKey: "cancel",
      icon: XCircle,
      destructive: true,
    },
  ],
  confirmed: [
    { status: "completed", actionKey: "markCompleted", icon: CheckCircle2 },
    {
      status: "cancelled",
      actionKey: "cancel",
      icon: XCircle,
      destructive: true,
    },
  ],
  completed: [],
  cancelled: [{ status: "scheduled", actionKey: "reschedule", icon: Clock }],
};

const QUICK_ACTION_CONFIG: Partial<
  Record<
    AppointmentStatus,
    {
      status: AppointmentStatus;
      actionKey: AppointmentActionKey;
      icon: React.ElementType;
    }
  >
> = {
  scheduled: { status: "confirmed", actionKey: "confirm", icon: ThumbsUp },
  confirmed: {
    status: "completed",
    actionKey: "markCompleted",
    icon: CheckCircle2,
  },
};

type SortColumn = "name" | "date" | "duration" | "price" | "status" | null;
type SortDir = "asc" | "desc";

function SortIcon({
  column,
  active,
  dir,
}: {
  column: SortColumn;
  active: SortColumn;
  dir: SortDir;
}) {
  if (active !== column)
    return (
      <ChevronsUpDown className="ml-1 h-3.5 w-3.5 text-muted-foreground/50 inline" />
    );
  return dir === "asc" ? (
    <ChevronUp className="ml-1 h-3.5 w-3.5 inline" />
  ) : (
    <ChevronDown className="ml-1 h-3.5 w-3.5 inline" />
  );
}

export function AppointmentList() {
  const { t } = useTranslation();
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<AppointmentFiltersValue>({});
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pending status changes (optimistic while mutation runs)
  const [pendingStatus, setPendingStatus] = useState<
    Record<string, AppointmentStatus>
  >({});

  // Detail sheet state
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentEntity | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const utils = useTrpc.useUtils();

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

  const STATUS_LABELS: Record<string, string> = {
    scheduled: "Cita programada",
    confirmed: "Cita confirmada",
    completed: "Cita completada",
    cancelled: "Cita cancelada",
  };

  const updateStatusMutation = useTrpc.appointment.updateStatus.useMutation({
    onSuccess: (_data, variables) => {
      toast.success(STATUS_LABELS[variables.status] ?? "Estado actualizado");
      // Update the open sheet to reflect the confirmed new status
      setSelectedAppointment((prev) =>
        prev?.id === variables.appointmentId
          ? { ...prev, status: variables.status }
          : prev
      );
      utils.appointment.getBusinessAppointments.invalidate();
    },
    onError: (error, variables) => {
      toast.error(error.message || "Error al actualizar el estado");
      // Revert the open sheet back to the real status from server data
      const real = appointments.find((a) => a.id === variables.appointmentId);
      if (real) {
        setSelectedAppointment((prev) =>
          prev?.id === variables.appointmentId
            ? { ...prev, status: real.status }
            : prev
        );
      }
    },
    onSettled: (_data, _err, variables) => {
      setPendingStatus((prev) => {
        const next = { ...prev };
        delete next[variables.appointmentId];
        return next;
      });
    },
  });

  const appointments = data?.appointments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const appointmentsWithPending = appointments;

  // Client-side search on loaded page
  const searched = useMemo(() => {
    if (!search) return appointmentsWithPending;
    const q = search.toLowerCase();
    return appointmentsWithPending.filter((apt: AppointmentEntity) => {
      const client = apt.customer
        ? `${apt.customer.firstName} ${apt.customer.lastName ?? ""}`.toLowerCase()
        : "";
      const service = apt.service?.name?.toLowerCase() ?? "";
      const employee = apt.providerBusinessUser?.user
        ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName ?? ""}`.toLowerCase()
        : "";
      return client.includes(q) || service.includes(q) || employee.includes(q);
    });
  }, [appointmentsWithPending, search]);

  // Client-side sort
  const filtered = useMemo(() => {
    if (!sortColumn) return searched;
    return [...searched].sort((a, b) => {
      let cmp = 0;
      if (sortColumn === "name") {
        const na = a.customer
          ? `${a.customer.firstName} ${a.customer.lastName ?? ""}`.trim()
          : "";
        const nb = b.customer
          ? `${b.customer.firstName} ${b.customer.lastName ?? ""}`.trim()
          : "";
        cmp = na.localeCompare(nb);
      } else if (sortColumn === "date") {
        cmp = new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      } else if (sortColumn === "duration") {
        cmp =
          (a.service?.durationMinutes ?? 0) - (b.service?.durationMinutes ?? 0);
      } else if (sortColumn === "price") {
        cmp = (a.service?.price ?? 0) - (b.service?.price ?? 0);
      } else if (sortColumn === "status") {
        cmp = (a.status ?? "").localeCompare(b.status ?? "");
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [searched, sortColumn, sortDir]);

  const handleSort = useCallback(
    (col: SortColumn) => {
      if (sortColumn === col) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(col);
        setSortDir("asc");
      }
    },
    [sortColumn]
  );

  const handleStatusChange = useCallback(
    (id: string, status: AppointmentStatus) => {
      setPendingStatus((prev) => ({ ...prev, [id]: status }));
      updateStatusMutation.mutate({ appointmentId: id, status });
    },
    [updateStatusMutation]
  );

  const handleOpenDetail = useCallback((apt: AppointmentEntity) => {
    setSelectedAppointment(apt);
    setSheetOpen(true);
  }, []);

  // Pagination page numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (page > 3) pages.push("...");
    for (
      let i = Math.max(2, page - 1);
      i <= Math.min(totalPages - 1, page + 1);
      i++
    ) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  }, [totalPages, page]);

  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          {t.pages.appointments.selectBusiness}
        </p>
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
            placeholder={t.pages.appointments.searchPlaceholder}
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

      {/* Table */}
      <div className="border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-[100px] text-muted-foreground">
                #
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                {t.pages.clients.name}
                <SortIcon column="name" active={sortColumn} dir={sortDir} />
              </TableHead>
              <TableHead>{t.pages.calendar.service}</TableHead>
              <TableHead>{t.pages.calendar.employee}</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("date")}
              >
                {t.pages.calendar.dateAndTime}
                <SortIcon column="date" active={sortColumn} dir={sortDir} />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("duration")}
              >
                {t.pages.services.duration}
                <SortIcon column="duration" active={sortColumn} dir={sortDir} />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("price")}
              >
                {t.pages.services.price}
                <SortIcon column="price" active={sortColumn} dir={sortDir} />
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => handleSort("status")}
              >
                {t.pages.payments.status}
                <SortIcon column="status" active={sortColumn} dir={sortDir} />
              </TableHead>
              <TableHead className="w-[90px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t.pages.appointments.noResults}
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
                const transitions = STATUS_TRANSITIONS_CONFIG[apt.status] ?? [];
                const quickAction = QUICK_ACTION_CONFIG[apt.status];
                const isPending = apt.id ? !!pendingStatus[apt.id] : false;

                return (
                  <TableRow
                    key={apt.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleOpenDetail(apt)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{apt.id?.slice(0, 8).toUpperCase() ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{clientName}</span>
                        {apt.customer?.email && (
                          <span className="text-xs text-muted-foreground">
                            {apt.customer.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">
                          {apt.service?.name ?? "—"}
                        </span>
                        {apt.service?.category?.name && (
                          <span className="text-xs text-muted-foreground">
                            {apt.service.category.name}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm">{employee}</span>
                        {apt.providerBusinessUser?.user?.email && (
                          <span className="text-xs text-muted-foreground">
                            {apt.providerBusinessUser.user.email}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{dateStr}</span>
                        <span className="text-sm text-muted-foreground">
                          {timeStr}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {duration}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {price}
                    </TableCell>
                    <TableCell>
                      {isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_VARIANT[apt.status] ?? ""}`}
                        >
                          {t.pages.appointments.status[apt.status] ?? apt.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell
                      onClick={(e) => e.stopPropagation()}
                      className="pr-2"
                    >
                      <div className="flex items-center gap-1 justify-end">
                        {/* Quick action button */}
                        {quickAction && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs"
                            disabled={isPending}
                            onClick={() =>
                              apt.id &&
                              handleStatusChange(apt.id, quickAction.status)
                            }
                          >
                            <quickAction.icon className="h-3.5 w-3.5 mr-1" />
                            {
                              t.pages.appointments.actions[
                                quickAction.actionKey
                              ]
                            }
                          </Button>
                        )}

                        {/* More actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              disabled={isPending}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenDetail(apt)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              {t.pages.appointments.actions.viewDetail}
                            </DropdownMenuItem>

                            {transitions.length > 0 && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                                  {t.pages.appointments.actions.changeStatus}
                                </DropdownMenuLabel>
                                {transitions.map(
                                  ({
                                    status,
                                    actionKey,
                                    icon: Icon,
                                    destructive,
                                  }) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onClick={() =>
                                        apt.id &&
                                        handleStatusChange(apt.id, status)
                                      }
                                      className={
                                        destructive
                                          ? "text-destructive focus:text-destructive"
                                          : ""
                                      }
                                    >
                                      <Icon className="mr-2 h-4 w-4" />
                                      {t.pages.appointments.actions[actionKey]}
                                    </DropdownMenuItem>
                                  )
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — always visible */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-xs text-muted-foreground">
          {total}{" "}
          {total === 1
            ? t.pages.appointments.countOne
            : t.pages.appointments.countMany}
          {hasActiveFilters && ` ${t.pages.appointments.filtered}`}
          {" · "}
          {t.pages.appointments.page} {page} {t.pages.appointments.of}{" "}
          {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((num, idx) =>
            num === "..." ? (
              <span
                key={`ellipsis-${idx}`}
                className="px-1 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={num}
                variant={page === num ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(num as number)}
                className="h-8 w-8 p-0"
              >
                {num}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detail sheet — only mount when open so internal state always starts fresh */}
      {sheetOpen && selectedAppointment && (
        <AppointmentDetailSheet
          appointment={selectedAppointment}
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
