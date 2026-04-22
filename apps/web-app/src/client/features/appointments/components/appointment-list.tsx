"use client";

import { useState, useMemo } from "react";
import {
  MoreHorizontal,
  Search,
  X,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Calendar } from "@/client/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import { cn } from "@/client/lib/utils";
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
import {
  formatInTz,
  startOfDayInTz,
  endOfDayInTz,
} from "@/client/lib/timezone-utils";
import type { Appointment as AppointmentEntity } from "@/server/core/domain/entities/Appointment";

const PAGE_SIZE = 20;

interface ComboboxOption {
  value: string;
  label: string;
}

interface FilterComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  allLabel: string;
  active?: boolean;
}

function FilterCombobox({
  options,
  value,
  onChange,
  placeholder,
  allLabel,
  active,
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={value !== "all" ? "default" : "outline"}
          size="sm"
          role="combobox"
          className={cn(
            "h-9 gap-1.5 min-w-[140px] justify-between font-normal",
            active && "rounded-r-none border-r-0"
          )}
        >
          <span className="truncate">
            {value !== "all" ? selected?.label : placeholder}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Buscar...`} className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                {allLabel}
              </CommandItem>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={`${option.label}-${option.value}`}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type StatusFilter =
  | "all"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

interface ServiceOption {
  id?: string;
  name: string;
  categoryId?: string | null;
}

interface CategoryOption {
  id?: string;
  name: string;
}

interface ServiceComboboxProps {
  services: ServiceOption[];
  categories: CategoryOption[];
  value: string;
  onChange: (value: string) => void;
  active?: boolean;
}

function ServiceCombobox({
  services,
  categories,
  value,
  onChange,
  active,
}: ServiceComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = services.find((s) => s.id === value);

  const categoryMap = useMemo(
    () =>
      Object.fromEntries(
        categories.filter((c) => c.id).map((c) => [c.id!, c.name])
      ),
    [categories]
  );

  const grouped = useMemo(() => {
    const map: Record<string, ServiceOption[]> = {};
    const uncategorized: ServiceOption[] = [];
    for (const s of services) {
      if (s.id && s.categoryId && categoryMap[s.categoryId]) {
        (map[s.categoryId] ??= []).push(s);
      } else {
        uncategorized.push(s);
      }
    }
    return { map, uncategorized };
  }, [services, categoryMap]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={value !== "all" ? "default" : "outline"}
          size="sm"
          role="combobox"
          className={cn(
            "h-9 gap-1.5 min-w-[140px] justify-between font-normal",
            active && "rounded-r-none border-r-0"
          )}
        >
          <span className="truncate">
            {value !== "all" ? selected?.name : "Servicio"}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar servicio..." className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                Todos los servicios
              </CommandItem>
            </CommandGroup>
            {/* Grouped by category */}
            {Object.entries(grouped.map).map(([catId, items]) => (
              <CommandGroup key={catId} heading={categoryMap[catId]}>
                {items.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={`${s.name}-${s.id}`}
                    onSelect={() => {
                      onChange(s.id!);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === s.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
            {/* Uncategorized */}
            {grouped.uncategorized.length > 0 && (
              <CommandGroup heading="Sin categoría">
                {grouped.uncategorized.map((s) => (
                  <CommandItem
                    key={s.id}
                    value={`${s.name}-${s.id}`}
                    onSelect={() => {
                      onChange(s.id!);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === s.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {s.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type DatePreset = "today" | "week" | "month" | "custom";

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

  // Filters state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [employeeId, setEmployeeId] = useState<string>("all");
  const [serviceId, setServiceId] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<DatePreset | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Compute UTC date bounds from preset or custom range
  const dateBounds = useMemo(() => {
    const now = new Date();
    if (datePreset === "today") {
      return {
        startAfter: startOfDayInTz(now, timezone).toISOString(),
        startBefore: endOfDayInTz(now, timezone).toISOString(),
      };
    }
    if (datePreset === "week") {
      return {
        startAfter: startOfDayInTz(
          startOfWeek(now, { weekStartsOn: 1 }),
          timezone
        ).toISOString(),
        startBefore: endOfDayInTz(
          endOfWeek(now, { weekStartsOn: 1 }),
          timezone
        ).toISOString(),
      };
    }
    if (datePreset === "month") {
      return {
        startAfter: startOfDayInTz(startOfMonth(now), timezone).toISOString(),
        startBefore: endOfDayInTz(endOfMonth(now), timezone).toISOString(),
      };
    }
    if (datePreset === "custom" && dateRange?.from) {
      return {
        startAfter: startOfDayInTz(dateRange.from, timezone).toISOString(),
        startBefore: endOfDayInTz(
          dateRange.to ?? dateRange.from,
          timezone
        ).toISOString(),
      };
    }
    return {};
  }, [datePreset, dateRange, timezone]);

  const filters = useMemo(
    () => ({
      ...(status !== "all"
        ? {
            status: status as
              | "scheduled"
              | "confirmed"
              | "completed"
              | "cancelled",
          }
        : {}),
      ...(employeeId !== "all" ? { providerBusinessUserId: employeeId } : {}),
      ...(serviceId !== "all" ? { serviceId } : {}),
      ...dateBounds,
    }),
    [status, employeeId, serviceId, dateBounds]
  );

  // Appointments query
  const { data, isLoading } =
    useTrpc.appointment.getBusinessAppointments.useQuery(
      {
        filters: Object.keys(filters).length ? filters : undefined,
        pagination: { limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE },
      },
      { enabled: !!currentBusiness?.id }
    );

  // Employees for select — returns BusinessUserWithDetails[]
  const { data: employees } = useTrpc.businessUser.getWithDetails.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );

  // Services for select — returns { services: [...] }
  const { data: servicesData } = useTrpc.service.list.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );

  // Service categories
  const { data: categoriesData } = useTrpc.serviceCategory.list.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );

  const appointments = data?.appointments ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Client-side search (on loaded page)
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

  const hasActiveFilters =
    status !== "all" ||
    employeeId !== "all" ||
    serviceId !== "all" ||
    datePreset !== null;

  const clearFilters = () => {
    setStatus("all");
    setEmployeeId("all");
    setServiceId("all");
    setDatePreset(null);
    setDateRange(undefined);
    setSearch("");
    setPage(1);
  };

  const handlePreset = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== "custom") setDateRange(undefined);
    setPage(1);
  };

  const dateLabel = () => {
    if (datePreset === "today") return "Hoy";
    if (datePreset === "week") return "Esta semana";
    if (datePreset === "month") return "Este mes";
    if (datePreset === "custom" && dateRange?.from) {
      if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
        return `${format(dateRange.from, "dd MMM")} – ${format(dateRange.to, "dd MMM")}`;
      }
      return format(dateRange.from, "dd MMM yyyy");
    }
    return "Fecha";
  };

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

        {/* Date range */}
        <div className="flex items-center">
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={datePreset ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-1.5 h-9",
                  datePreset && "rounded-r-none border-r-0"
                )}
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                {dateLabel()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex gap-1 p-2 border-b">
                {(["today", "week", "month"] as const).map((p) => (
                  <Button
                    key={p}
                    variant={datePreset === p ? "default" : "ghost"}
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => {
                      handlePreset(p);
                      setCalendarOpen(false);
                    }}
                  >
                    {p === "today"
                      ? "Hoy"
                      : p === "week"
                        ? "Esta semana"
                        : "Este mes"}
                  </Button>
                ))}
                <Button
                  variant={datePreset === "custom" ? "default" : "ghost"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => handlePreset("custom")}
                >
                  Personalizado
                </Button>
              </div>
              {datePreset === "custom" && (
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    setPage(1);
                    if (range?.from && range?.to) setCalendarOpen(false);
                  }}
                  numberOfMonths={2}
                />
              )}
            </PopoverContent>
          </Popover>
          {datePreset && (
            <Button
              variant="default"
              size="sm"
              className="h-9 w-7 rounded-l-none px-0"
              onClick={() => {
                setDatePreset(null);
                setDateRange(undefined);
                setPage(1);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center">
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as StatusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger
              className={cn(
                "h-9",
                status !== "all"
                  ? "w-[140px] rounded-r-none border-r-0"
                  : "w-[150px]"
              )}
            >
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="scheduled">Agendada</SelectItem>
              <SelectItem value="confirmed">Confirmada</SelectItem>
              <SelectItem value="completed">Completada</SelectItem>
              <SelectItem value="cancelled">Cancelada</SelectItem>
            </SelectContent>
          </Select>
          {status !== "all" && (
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-7 rounded-l-none px-0"
              onClick={() => {
                setStatus("all");
                setPage(1);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Employee */}
        {employees && employees.length > 0 && (
          <div className="flex items-center">
            <FilterCombobox
              placeholder="Empleado"
              allLabel="Todos los empleados"
              value={employeeId}
              onChange={(v) => {
                setEmployeeId(v);
                setPage(1);
              }}
              options={employees.map((bu) => ({
                value: bu.id,
                label: `${bu.user.firstName} ${bu.user.lastName}`.trim(),
              }))}
              active={employeeId !== "all"}
            />
            {employeeId !== "all" && (
              <Button
                variant="default"
                size="sm"
                className="h-9 w-7 rounded-l-none px-0"
                onClick={() => {
                  setEmployeeId("all");
                  setPage(1);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Service */}
        {servicesData?.services && servicesData.services.length > 0 && (
          <div className="flex items-center">
            <ServiceCombobox
              services={servicesData.services}
              categories={categoriesData?.categories ?? []}
              value={serviceId}
              onChange={(v) => {
                setServiceId(v);
                setPage(1);
              }}
              active={serviceId !== "all"}
            />
            {serviceId !== "all" && (
              <Button
                variant="default"
                size="sm"
                className="h-9 w-7 rounded-l-none px-0"
                onClick={() => {
                  setServiceId("all");
                  setPage(1);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}

        {/* Clear all */}
        {(hasActiveFilters || search) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Limpiar todo
          </Button>
        )}
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
