"use client";

import { useMemo } from "react";

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number;
  startTime: Date;
  endTime: Date;
}

interface ExceptionSlot {
  id: string;
  date: Date;
  isAllDay: boolean;
  startTime?: Date;
  endTime?: Date;
  isAvailable: boolean;
  reason?: string;
}

interface WeeklyScheduleCalendarProps {
  availabilities: AvailabilitySlot[];
  exceptions: ExceptionSlot[];
  weekDate?: Date; // For showing specific week with exceptions
}

const DAYS = [
  { value: 1, label: "Lun", fullLabel: "Lunes" },
  { value: 2, label: "Mar", fullLabel: "Martes" },
  { value: 3, label: "Mié", fullLabel: "Miércoles" },
  { value: 4, label: "Jue", fullLabel: "Jueves" },
  { value: 5, label: "Vie", fullLabel: "Viernes" },
  { value: 6, label: "Sáb", fullLabel: "Sábado" },
  { value: 0, label: "Dom", fullLabel: "Domingo" },
];

const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 08:00 to 22:00

function getTimeInMinutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function formatTime(hour: number): string {
  return `${hour.toString().padStart(2, "0")}:00`;
}

function getWeekDates(weekDate: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(weekDate);

  // Get Monday of the week
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  current.setDate(diff);

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function WeeklyScheduleCalendar({
  availabilities,
  exceptions,
  weekDate = new Date(),
}: WeeklyScheduleCalendarProps) {
  const weekDates = useMemo(() => getWeekDates(weekDate), [weekDate]);

  const getSlotInfo = (dayOfWeek: number, hour: number) => {
    const hourStart = hour * 60;
    const hourEnd = (hour + 1) * 60;
    const currentDate = weekDates[dayOfWeek === 0 ? 6 : dayOfWeek - 1];

    // Check for exceptions first (they override regular availability)
    const dayExceptions = exceptions.filter((exc) =>
      isSameDate(new Date(exc.date), currentDate)
    );

    for (const exception of dayExceptions) {
      if (exception.isAllDay) {
        return {
          type: exception.isAvailable ? "extra" : "blocked",
          label: exception.isAvailable ? "Horas Extra" : "Bloqueado",
          reason: exception.reason,
          color: exception.isAvailable
            ? "bg-amber-100 text-amber-900 border-amber-300"
            : "bg-red-100 text-red-900 border-red-300",
        };
      } else if (exception.startTime && exception.endTime) {
        const excStart = getTimeInMinutes(new Date(exception.startTime));
        const excEnd = getTimeInMinutes(new Date(exception.endTime));

        if (hourStart >= excStart && hourEnd <= excEnd) {
          return {
            type: exception.isAvailable ? "extra" : "blocked",
            label: exception.isAvailable ? "H. Extra" : "Bloqueado",
            reason: exception.reason,
            color: exception.isAvailable
              ? "bg-amber-100 text-amber-900 border-amber-300"
              : "bg-red-100 text-red-900 border-red-300",
          };
        }
      }
    }

    // Check regular availability
    const dayAvailabilities = availabilities.filter(
      (avail) => avail.dayOfWeek === dayOfWeek
    );

    for (const avail of dayAvailabilities) {
      const availStart = getTimeInMinutes(new Date(avail.startTime));
      const availEnd = getTimeInMinutes(new Date(avail.endTime));

      if (hourStart >= availStart && hourEnd <= availEnd) {
        return {
          type: "available",
          label: "Disponible",
          color: "bg-green-100 text-green-900 border-green-300",
        };
      }
    }

    return null;
  };

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap gap-2 sm:gap-4 text-[10px] sm:text-xs">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-green-100 border border-green-300" />
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-red-100 border border-red-300" />
          <span>Bloqueado</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded bg-amber-100 border border-amber-300" />
          <span>Horas Extra</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-1 sm:p-2 text-[10px] sm:text-xs font-medium sticky left-0 bg-muted z-10 min-w-[45px] sm:min-w-[60px]">
                  Hora
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day.value}
                    className="border p-1 sm:p-2 text-[10px] sm:text-xs font-medium min-w-[65px] sm:min-w-[100px]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="font-semibold">{day.label}</span>
                      {weekDate && (
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground">
                          {weekDates[
                            day.value === 0 ? 6 : day.value - 1
                          ].getDate()}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="border p-1 sm:p-2 text-[10px] sm:text-xs text-center sticky left-0 bg-background z-10 font-medium">
                    {formatTime(hour)}
                  </td>
                  {DAYS.map((day) => {
                    const slotInfo = getSlotInfo(day.value, hour);
                    return (
                      <td key={day.value} className="border p-0.5">
                        {slotInfo ? (
                          <div
                            className={`h-10 sm:h-12 flex items-center justify-center rounded text-[9px] sm:text-[10px] font-medium border ${slotInfo.color} group relative px-0.5`}
                            title={slotInfo.reason || slotInfo.label}
                          >
                            <span className="hidden sm:inline">
                              {slotInfo.label}
                            </span>
                            <span className="sm:hidden text-center leading-tight">
                              {slotInfo.type === "available"
                                ? "Disp"
                                : slotInfo.type === "extra"
                                  ? "Extra"
                                  : "Bloq"}
                            </span>
                            {slotInfo.reason && (
                              <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-20">
                                {slotInfo.reason}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-10 sm:h-12" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
