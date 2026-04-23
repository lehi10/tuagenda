"use client";

import { cn } from "@/client/lib/utils";

const SCHEDULE = [
  ["Lunes – Viernes", "9:00 – 20:00"],
  ["Sábado", "10:00 – 17:00"],
  ["Domingo", "Cerrado"],
] as const;

interface SchedulePopupProps {
  onClose: () => void;
}

export function SchedulePopup({ onClose }: SchedulePopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-card border shadow-xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-base mb-4">Horario de atención</h3>
        {/* ###TODO### – real schedule from business settings */}
        <div className="space-y-0 divide-y">
          {SCHEDULE.map(([day, hours]) => (
            <div key={day} className="flex justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{day}</span>
              <span
                className={cn(
                  "font-semibold",
                  hours === "Cerrado" && "text-muted-foreground"
                )}
              >
                {hours}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 flex gap-2">
          <span>⚠️</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Horarios en feriados pueden variar. Consulta directamente con el
            negocio.
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
