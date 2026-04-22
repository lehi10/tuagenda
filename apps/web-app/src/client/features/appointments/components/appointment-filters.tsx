"use client";

import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/client/components/ui/button";
import { DateRangeFilter } from "@/client/components/filters/date-range-filter";
import { SelectFilter } from "@/client/components/filters/select-filter";
import { ComboboxFilter } from "@/client/components/filters/combobox-filter";
import { GroupedComboboxFilter } from "@/client/components/filters/grouped-combobox-filter";
import type { GroupedComboboxGroup } from "@/client/components/filters/grouped-combobox-filter";
import { useBusiness } from "@/client/contexts/business-context";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { useTrpc } from "@/client/lib/trpc";
import { startOfDayInTz, endOfDayInTz } from "@/client/lib/timezone-utils";

export type AppointmentStatusFilter =
  | "all"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface AppointmentFiltersValue {
  status?: "scheduled" | "confirmed" | "completed" | "cancelled";
  providerBusinessUserId?: string;
  serviceId?: string;
  startAfter?: string;
  startBefore?: string;
}

export interface AppointmentFiltersProps {
  onChange: (filters: AppointmentFiltersValue, hasActive: boolean) => void;
}

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Agendada" },
  { value: "confirmed", label: "Confirmada" },
  { value: "completed", label: "Completada" },
  { value: "cancelled", label: "Cancelada" },
];

export function AppointmentFilters({ onChange }: AppointmentFiltersProps) {
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();

  const [status, setStatus] = useState<AppointmentStatusFilter>("all");
  const [employeeId, setEmployeeId] = useState("all");
  const [serviceId, setServiceId] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Fetch employees, services, categories for filter options
  const { data: employees } = useTrpc.businessUser.getWithDetails.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );
  const { data: servicesData } = useTrpc.service.list.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );
  const { data: categoriesData } = useTrpc.serviceCategory.list.useQuery(
    {},
    { enabled: !!currentBusiness?.id }
  );

  // Build grouped service options for ServiceFilter
  const serviceGroups = useMemo<GroupedComboboxGroup[]>(() => {
    const services = servicesData?.services ?? [];
    const categories = categoriesData?.categories ?? [];
    const categoryMap = Object.fromEntries(
      categories.filter((c) => c.id).map((c) => [c.id!, c.name])
    );

    const grouped: Record<string, GroupedComboboxGroup> = {};
    const uncategorized: { id: string; name: string }[] = [];

    for (const s of services) {
      if (!s.id) continue;
      if (s.categoryId && categoryMap[s.categoryId]) {
        const label = categoryMap[s.categoryId];
        (grouped[s.categoryId] ??= { label, options: [] }).options.push({
          id: s.id,
          name: s.name,
        });
      } else {
        uncategorized.push({ id: s.id, name: s.name });
      }
    }

    const result = Object.values(grouped);
    if (uncategorized.length > 0) {
      result.push({ label: "Sin categoría", options: uncategorized });
    }
    return result;
  }, [servicesData, categoriesData]);

  const dateBounds = useMemo(() => {
    if (dateRange?.from) {
      return {
        startAfter: startOfDayInTz(dateRange.from, timezone).toISOString(),
        startBefore: endOfDayInTz(
          dateRange.to ?? dateRange.from,
          timezone
        ).toISOString(),
      };
    }
    return {};
  }, [dateRange, timezone]);

  const hasActive =
    status !== "all" ||
    employeeId !== "all" ||
    serviceId !== "all" ||
    !!dateRange;

  const filters: AppointmentFiltersValue = useMemo(
    () => ({
      ...(status !== "all"
        ? { status: status as Exclude<AppointmentStatusFilter, "all"> }
        : {}),
      ...(employeeId !== "all" ? { providerBusinessUserId: employeeId } : {}),
      ...(serviceId !== "all" ? { serviceId } : {}),
      ...dateBounds,
    }),
    [status, employeeId, serviceId, dateBounds]
  );

  useEffect(() => {
    onChange(filters, hasActive);
  }, [filters, hasActive, onChange]);

  const clearFilters = () => {
    setStatus("all");
    setEmployeeId("all");
    setServiceId("all");
    setDateRange(undefined);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Date range */}
      <div className="flex items-center">
        <DateRangeFilter
          value={dateRange}
          onChange={setDateRange}
          active={!!dateRange}
        />
        {dateRange && (
          <Button
            variant="default"
            size="sm"
            className="h-9 w-7 rounded-l-none px-0"
            onClick={() => setDateRange(undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Status */}
      <div className="flex items-center">
        <SelectFilter
          options={STATUS_OPTIONS}
          value={status}
          onChange={(v) => setStatus(v as AppointmentStatusFilter)}
          allLabel="Todos los estados"
          active={status !== "all"}
        />
        {status !== "all" && (
          <Button
            variant="default"
            size="sm"
            className="h-9 w-7 rounded-l-none px-0"
            onClick={() => setStatus("all")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Employee */}
      {employees && employees.length > 0 && (
        <div className="flex items-center">
          <ComboboxFilter
            placeholder="Empleado"
            allLabel="Todos los empleados"
            value={employeeId}
            onChange={setEmployeeId}
            options={employees.map((bu) => ({
              value: bu.id,
              label: `${bu.user.firstName} ${bu.user.lastName ?? ""}`.trim(),
            }))}
            active={employeeId !== "all"}
          />
          {employeeId !== "all" && (
            <Button
              variant="default"
              size="sm"
              className="h-9 w-7 rounded-l-none px-0"
              onClick={() => setEmployeeId("all")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Service */}
      {serviceGroups.length > 0 && (
        <div className="flex items-center">
          <GroupedComboboxFilter
            groups={serviceGroups}
            value={serviceId}
            onChange={setServiceId}
            placeholder="Servicio"
            allLabel="Todos los servicios"
            searchPlaceholder="Buscar servicio..."
            active={serviceId !== "all"}
          />
          {serviceId !== "all" && (
            <Button
              variant="default"
              size="sm"
              className="h-9 w-7 rounded-l-none px-0"
              onClick={() => setServiceId("all")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Clear all */}
      {hasActive && (
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
  );
}
