"use client";

import { Button } from "@/client/components/ui/button";
import { Pencil, Calendar, Clock, User, Scissors } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatPrice } from "@/client/lib/booking-utils";
import type { BookingData, StepType } from "@/client/types/booking";

interface BookingOrderSummaryStepProps {
  bookingData: BookingData;
  currency: string;
  onConfirm: () => void;
  onEdit: (step: StepType) => void;
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  onEdit?: () => void;
  children: React.ReactNode;
}

function SummaryRow({ icon, label, onEdit, children }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0">
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground leading-none mb-0.5">
          {label}
        </p>
        {children}
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          aria-label={`Editar ${label.toLowerCase()}`}
        >
          <Pencil className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export function BookingOrderSummaryStep({
  bookingData,
  currency,
  onConfirm,
  onEdit,
}: BookingOrderSummaryStepProps) {
  const { service, professional, date, timeSlot, clientInfo } = bookingData;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-0.5">
        <p className="text-sm text-muted-foreground">Casi listo ✨</p>
        <h2 className="text-2xl font-semibold tracking-tight">
          Revisa tu reserva
        </h2>
      </div>

      {/* Single summary card */}
      <div className="rounded-xl border bg-card px-4">
        {clientInfo && (
          <SummaryRow icon={<User className="h-3.5 w-3.5" />} label="Tus datos">
            <p className="font-semibold text-sm">
              {clientInfo.firstName} {clientInfo.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{clientInfo.email}</p>
          </SummaryRow>
        )}

        {service && (
          <SummaryRow
            icon={<Scissors className="h-3.5 w-3.5" />}
            label="Servicio"
            onEdit={() => onEdit("service-detail")}
          >
            <p className="font-semibold text-sm">{service.name}</p>
            <p className="text-xs text-muted-foreground">
              {service.durationMinutes} min
            </p>
          </SummaryRow>
        )}

        {professional && (
          <SummaryRow
            icon={<User className="h-3.5 w-3.5" />}
            label="Profesional"
            onEdit={() => onEdit("professional")}
          >
            <p className="font-semibold text-sm">{professional.name}</p>
          </SummaryRow>
        )}

        {date && timeSlot && (
          <SummaryRow
            icon={<Calendar className="h-3.5 w-3.5" />}
            label="Fecha y hora"
            onEdit={() => onEdit("date")}
          >
            <p className="font-semibold text-sm capitalize">
              {format(date, "EEEE d 'de' MMMM", { locale: es })}
            </p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{timeSlot}</p>
            </div>
          </SummaryRow>
        )}
      </div>

      {/* Total + CTA */}
      <div className="rounded-xl border bg-card px-4 py-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">Total</p>
        <p className="text-xl font-bold text-primary">
          {service ? formatPrice(service.price, currency) : "—"}
        </p>
      </div>

      <Button
        className="w-full h-12 rounded-xl font-semibold"
        size="lg"
        onClick={onConfirm}
      >
        Continuar al pago →
      </Button>
    </div>
  );
}
