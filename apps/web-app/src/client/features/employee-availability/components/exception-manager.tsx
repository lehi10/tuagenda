"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Switch } from "@/client/components/ui/switch";
import { Badge } from "@/client/components/ui/badge";
import { useBusiness } from "@/client/contexts";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { useTrpc } from "@/client/lib/trpc";
import { fromZonedTime, formatInTz } from "@/client/lib/timezone-utils";

interface ExceptionManagerProps {
  businessUserId: string;
}

export function ExceptionManager({ businessUserId }: ExceptionManagerProps) {
  const { currentBusiness } = useBusiness();
  const { timezone } = useBusinessTimezone();
  const utils = useTrpc.useUtils();

  const [date, setDate] = useState("");
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");
  const [isAvailable, setIsAvailable] = useState(false);
  const [reason, setReason] = useState("");

  const { data: exceptions, isLoading } =
    useTrpc.employeeException.getByEmployee.useQuery(
      { businessUserId },
      { enabled: !!businessUserId }
    );

  const createMutation = useTrpc.employeeException.create.useMutation({
    onSuccess: () => {
      utils.employeeException.getByEmployee.invalidate({ businessUserId });
      toast.success("Excepción agregada");
      // Reset form
      setDate("");
      setReason("");
      setIsAllDay(true);
      setIsAvailable(false);
    },
  });

  const deleteMutation = useTrpc.employeeException.delete.useMutation({
    onSuccess: () => {
      utils.employeeException.getByEmployee.invalidate({ businessUserId });
      toast.success("Excepción eliminada");
    },
  });

  const handleAdd = async () => {
    if (!currentBusiness?.id || !date) return;

    try {
      // `date` is "YYYY-MM-DD" — parsed as UTC midnight per the ISO 8601 spec. ✓
      const exceptionDate = new Date(date);
      // Times entered by employee are in the business timezone → convert to UTC.
      const start = isAllDay
        ? undefined
        : fromZonedTime(new Date(`${date}T${startTime}:00`), timezone);
      const end = isAllDay
        ? undefined
        : fromZonedTime(new Date(`${date}T${endTime}:00`), timezone);

      await createMutation.mutateAsync({
        businessUserId,
        businessId: currentBusiness.id,
        date: exceptionDate,
        isAllDay,
        startTime: start,
        endTime: end,
        isAvailable,
        reason: reason || undefined,
      });
    } catch (_error) {
      toast.error("Error al agregar excepción");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync({ id });
    } catch (_error) {
      toast.error("Error al eliminar excepción");
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Form */}
      <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
        <h4 className="text-sm font-medium">Agregar Excepción</h4>

        <div className="space-y-2">
          <Label htmlFor="exception-date">Fecha</Label>
          <Input
            id="exception-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="all-day">Todo el día</Label>
          <Switch
            id="all-day"
            checked={isAllDay}
            onCheckedChange={setIsAllDay}
          />
        </div>

        {!isAllDay && (
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="start-time">Hora inicio</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time">Hora fin</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Label htmlFor="is-available">Disponible (horas extra)</Label>
          <Switch
            id="is-available"
            checked={isAvailable}
            onCheckedChange={setIsAvailable}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Motivo (opcional)</Label>
          <Input
            id="reason"
            placeholder="Vacaciones, cita médica, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <Button
          size="sm"
          onClick={handleAdd}
          disabled={createMutation.isPending || !date}
          className="w-full"
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

      {/* Exceptions List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !exceptions || exceptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No hay excepciones configuradas
          </div>
        ) : (
          exceptions.map((exception) => (
            <div
              key={exception.id}
              className="p-3 rounded-lg border group space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatInTz(new Date(exception.date), timezone, "d 'de' MMMM yyyy")}
                    </span>
                    <Badge
                      variant={exception.isAvailable ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {exception.isAvailable ? "Disponible" : "Bloqueado"}
                    </Badge>
                  </div>

                  {!exception.isAllDay &&
                    exception.startTime &&
                    exception.endTime && (
                      <div className="text-xs text-muted-foreground">
                        {formatInTz(new Date(exception.startTime), timezone, "HH:mm")} -{" "}
                        {formatInTz(new Date(exception.endTime), timezone, "HH:mm")}
                      </div>
                    )}

                  {exception.reason && (
                    <div className="text-xs text-muted-foreground">
                      {exception.reason}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(exception.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
