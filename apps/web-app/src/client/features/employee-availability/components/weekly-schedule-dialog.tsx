"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { useTrpc } from "@/client/lib/trpc";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { startOfDayInTz, endOfDayInTz, formatInTz } from "@/client/lib/timezone-utils";
import { WeeklyScheduleCalendar } from "./weekly-schedule-calendar";

interface WeeklyScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessUserId: string;
  employeeName: string;
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getUTCDay(); // use UTC to avoid local-timezone day shift
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d;
}

export function WeeklyScheduleDialog({
  open,
  onOpenChange,
  businessUserId,
  employeeName,
}: WeeklyScheduleDialogProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { timezone } = useBusinessTimezone();

  const monday = getMondayOfWeek(currentWeek);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  // UTC-correct week boundaries based on business timezone
  const weekStart = startOfDayInTz(monday, timezone);
  const weekEnd = endOfDayInTz(sunday, timezone);

  // Fetch availabilities
  const { data: availabilities, isLoading: loadingAvailabilities } =
    useTrpc.employeeAvailability.getByEmployee.useQuery(
      { businessUserId },
      { enabled: !!businessUserId && open }
    );

  // Fetch exceptions for the current week
  const { data: exceptions, isLoading: loadingExceptions } =
    useTrpc.employeeException.getByDateRange.useQuery(
      {
        businessUserId,
        startDate: weekStart,
        endDate: weekEnd,
      },
      { enabled: !!businessUserId && open }
    );

  const isLoading = loadingAvailabilities || loadingExceptions;

  const goToPreviousWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 7);
      return newDate;
    });
  };

  const goToNextWeek = () => {
    setCurrentWeek((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 7);
      return newDate;
    });
  };

  const goToCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] sm:max-w-[95vw] lg:max-w-7xl xl:max-w-[90vw] max-h-[95vh] sm:max-h-[90vh] flex flex-col p-3 sm:p-6">
        <DialogHeader className="space-y-1 sm:space-y-2">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="truncate">Horario Semanal - {employeeName}</span>
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Vista del calendario semanal con disponibilidad y excepciones
          </DialogDescription>
        </DialogHeader>

        {/* Week Navigation */}
        <div className="flex items-center justify-between gap-2 border-b pb-3 sm:pb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            disabled={isLoading}
            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center">
            <span className="text-xs sm:text-sm font-medium text-center">
              {formatInTz(weekStart, timezone, "d MMM")} – {formatInTz(weekEnd, timezone, "d MMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goToCurrentWeek}
              disabled={isLoading}
              className="h-7 px-2 text-xs sm:h-8 sm:px-3 sm:text-sm"
            >
              Hoy
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            disabled={isLoading}
            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 overflow-auto -mx-3 px-3 sm:mx-0 sm:px-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <WeeklyScheduleCalendar
              availabilities={availabilities || []}
              exceptions={exceptions || []}
              weekDate={currentWeek}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="border-t pt-3 sm:pt-4 text-xs text-muted-foreground">
          <p className="hidden sm:block">
            💡 <strong>Tip:</strong> Navega entre semanas para ver excepciones
            futuras programadas (vacaciones, citas médicas, etc.)
          </p>
          <p className="sm:hidden text-center">
            💡 Navega entre semanas para ver excepciones futuras
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
