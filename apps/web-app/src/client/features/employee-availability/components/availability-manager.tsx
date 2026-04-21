"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { useBusiness } from "@/client/contexts";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { useTrpc } from "@/client/lib/trpc";
import { fromZonedTime, formatInTz } from "@/client/lib/timezone-utils";

interface AvailabilityManagerProps {
  businessUserId: string;
}

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export function AvailabilityManager({
  businessUserId,
}: AvailabilityManagerProps) {
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();
  const utils = useTrpc.useUtils();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  const { data: availabilities, isLoading } =
    useTrpc.employeeAvailability.getByEmployee.useQuery(
      { businessUserId },
      { enabled: !!businessUserId }
    );

  const createMutation = useTrpc.employeeAvailability.create.useMutation({
    onSuccess: () => {
      utils.employeeAvailability.getByEmployee.invalidate({ businessUserId });
      toast.success("Horario agregado");
    },
  });

  const deleteMutation = useTrpc.employeeAvailability.delete.useMutation({
    onSuccess: () => {
      utils.employeeAvailability.getByEmployee.invalidate({ businessUserId });
      toast.success("Horario eliminado");
    },
  });

  const handleAdd = async () => {
    if (!currentBusiness?.id) return;

    try {
      // Times entered by the employee are in the business timezone.
      // Convert to UTC before sending to the backend.
      const start = fromZonedTime(
        new Date(`2000-01-01T${startTime}:00`),
        timezone
      );
      const end = fromZonedTime(new Date(`2000-01-01T${endTime}:00`), timezone);

      await createMutation.mutateAsync({
        businessUserId,
        businessId: currentBusiness.id,
        dayOfWeek: selectedDay,
        startTime: start,
        endTime: end,
      });
    } catch (_error) {
      toast.error("Error al agregar horario");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (_error) {
      toast.error("Error al eliminar horario");
    }
  };

  // Group availabilities by day
  const availabilitiesByDay = availabilities?.reduce(
    (acc, avail) => {
      if (!acc[avail.dayOfWeek]) {
        acc[avail.dayOfWeek] = [];
      }
      acc[avail.dayOfWeek].push(avail);
      return acc;
    },
    {} as Record<number, typeof availabilities>
  );

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="p-4 border rounded-lg bg-muted/30">
        <h4 className="text-sm font-medium mb-3">Agregar Horario</h4>
        <div className="grid grid-cols-4 gap-2">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(Number(e.target.value))}
            className="col-span-2 h-9 px-3 rounded-md border bg-background text-sm"
          >
            {DAYS_OF_WEEK.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-9 px-3 rounded-md border bg-background text-sm"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-9 px-3 rounded-md border bg-background text-sm"
          />
        </div>
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={createMutation.isPending}
          className="mt-2 w-full"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </>
          )}
        </Button>
      </div>

      {/* Availability List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !availabilities || availabilities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay horarios configurados
          </div>
        ) : (
          DAYS_OF_WEEK.map((day) => {
            const dayAvails = availabilitiesByDay?.[day.value] || [];
            if (dayAvails.length === 0) return null;

            return (
              <div key={day.value} className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">
                  {day.label}
                </div>
                {dayAvails.map((avail) => (
                  <div
                    key={avail.id}
                    className="flex items-center gap-2 p-2 rounded-md border group"
                  >
                    <div className="flex-1 text-sm">
                      {formatInTz(new Date(avail.startTime), timezone, "HH:mm")}{" "}
                      - {formatInTz(new Date(avail.endTime), timezone, "HH:mm")}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(avail.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
