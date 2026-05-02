"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Briefcase,
  Phone,
  Mail,
  DollarSign,
  Timer,
  Users,
  CalendarClock,
  X,
  Ban,
  MessageCircle,
  Copy,
  Check,
  UserCheck,
  UserX,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  Circle,
} from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Textarea } from "@/client/components/ui/textarea";
import { Calendar } from "@/client/components/ui/calendar";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/client/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/client/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { useBusinessTimezone } from "@/client/contexts/business-timezone-context";
import { useBusiness } from "@/client/contexts/business-context";
import { formatInTz } from "@/client/lib/timezone-utils";
import { formatCurrency } from "@/client/lib/currency-utils";
import type {
  Appointment,
  AppointmentStatus,
} from "@/server/core/domain/entities/Appointment";

const STATUS_COLOR: Record<AppointmentStatus, string> = {
  completed:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  confirmed:
    "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  scheduled:
    "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
  cancelled:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
};

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  scheduled: "Programada",
  confirmed: "Confirmada",
  completed: "Completada",
  cancelled: "Cancelada",
};

const STATUS_ICON: Record<AppointmentStatus, React.ElementType> = {
  scheduled: Circle,
  confirmed: ThumbsUp,
  completed: CheckCircle2,
  cancelled: XCircle,
};

const ALL_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
];

interface AppointmentDetailSheetProps {
  appointment: Appointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: AppointmentStatus) => void;
  isPendingStatusChange?: boolean;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

function CopyButton({ value, tooltip }: { value: string; tooltip: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCopy}
          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-500" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top">
        {copied ? "¡Copiado!" : tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

/** Generates mock available slots for an employee on a given date. */
function getMockSlots(
  date: Date,
  employeeId: string | undefined,
  durationMinutes: number
): { time: string; available: boolean }[] {
  const seed = `${date.toDateString()}-${employeeId ?? "x"}`;
  let h = 0;
  for (let i = 0; i < seed.length; i++)
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;

  const slots: { time: string; available: boolean }[] = [];
  let minutes = 8 * 60;
  while (minutes + durationMinutes <= 18 * 60) {
    const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
    const mm = String(minutes % 60).padStart(2, "0");
    const slotSeed = (h ^ (minutes * 2654435761)) >>> 0;
    slots.push({ time: `${hh}:${mm}`, available: slotSeed % 3 !== 0 });
    minutes += durationMinutes;
  }
  return slots;
}

function formatSlotLabel(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = parseInt(hStr, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${suffix}`;
}

export function AppointmentDetailSheet({
  appointment,
  open,
  onOpenChange,
  onStatusChange,
  isPendingStatusChange = false,
}: AppointmentDetailSheetProps) {
  const { timezone } = useBusinessTimezone();
  const { currentBusiness } = useBusiness();

  const [editedStatus, setEditedStatus] = useState<AppointmentStatus>(
    appointment?.status ?? "scheduled"
  );
  const [editedNotes, setEditedNotes] = useState(appointment?.notes ?? "");
  const [isDirty, setIsDirty] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const wasPending = useRef(false);

  useEffect(() => {
    if (appointment) {
      setEditedStatus(appointment.status);
      setEditedNotes(appointment.notes ?? "");
      setIsDirty(false);
      setIsRescheduling(false);
      setSelectedSlot(null);
    }
  }, [appointment?.id, appointment?.status, appointment?.notes]);

  // When the mutation finishes, revert editedStatus to the real server status.
  // This handles the failure case where appointment.status never changed so the
  // effect above wouldn't fire, leaving editedStatus stuck on the failed value.
  useEffect(() => {
    if (wasPending.current && !isPendingStatusChange && appointment) {
      setEditedStatus(appointment.status);
      setIsDirty(false);
    }
    wasPending.current = isPendingStatusChange;
  }, [isPendingStatusChange, appointment]);

  const handleStatusChange = useCallback((value: AppointmentStatus) => {
    setEditedStatus(value);
    setIsDirty(true);
  }, []);

  const openReschedule = useCallback(() => {
    if (!appointment) return;
    setRescheduleDate(new Date(appointment.startTime));
    setSelectedSlot(null);
    setIsRescheduling(true);
  }, [appointment]);

  const cancelReschedule = useCallback(() => {
    setIsRescheduling(false);
    setSelectedSlot(null);
  }, []);

  const applyReschedule = useCallback(() => {
    setIsRescheduling(false);
    setSelectedSlot(null);
    setIsDirty(true);
  }, []);

  const handleSave = useCallback(() => {
    if (appointment?.id && editedStatus !== appointment.status) {
      onStatusChange(appointment.id, editedStatus);
    }
    setIsDirty(false);
  }, [appointment, editedStatus, onStatusChange]);

  const handleDiscard = useCallback(() => {
    if (!appointment) return;
    setEditedStatus(appointment.status);
    setEditedNotes(appointment.notes ?? "");
    setIsRescheduling(false);
    setSelectedSlot(null);
    setIsDirty(false);
  }, [appointment]);

  if (!appointment) return null;

  const customer = appointment.customer;
  const hasAccount = !!appointment.customerId;
  const clientName = customer
    ? `${customer.firstName} ${customer.lastName ?? ""}`.trim()
    : null;
  const clientInitials = customer
    ? `${customer.firstName[0]}${customer.lastName?.[0] ?? ""}`.toUpperCase()
    : "?";

  const employee = appointment.providerBusinessUser;
  const employeeName = employee?.user
    ? `${employee.user.firstName} ${employee.user.lastName ?? ""}`.trim()
    : "—";

  const startDate = new Date(appointment.startTime);
  const endDate = new Date(appointment.endTime);
  const dateStr = formatInTz(startDate, timezone, "dd 'de' MMMM yyyy");
  const dayStr = formatInTz(startDate, timezone, "EEEE");
  const timeStart = formatInTz(startDate, timezone, "h:mm a");
  const timeEnd = formatInTz(endDate, timezone, "h:mm a");
  const duration = appointment.service?.durationMinutes
    ? `${appointment.service.durationMinutes} min`
    : "—";
  const price =
    appointment.service?.price != null
      ? formatCurrency(
          appointment.service.price,
          currentBusiness?.currency ?? "USD"
        )
      : "—";
  const createdAt = appointment.createdAt
    ? formatInTz(
        new Date(appointment.createdAt),
        timezone,
        "dd MMM yyyy, h:mm a"
      )
    : "—";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex flex-col p-0"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest("[data-sonner-toaster]")) {
            e.preventDefault();
          }
        }}
      >
        {/* ── Header ─────────────────────────── */}
        <SheetHeader className="px-5 pt-5 pb-3 border-b space-y-1.5">
          <div className="flex items-center justify-between pr-7">
            <SheetTitle className="text-sm font-semibold text-muted-foreground">
              #{appointment.id?.slice(0, 8).toUpperCase() ?? "—"}
            </SheetTitle>
            <Select value={editedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger
                className={`w-fit h-7 text-xs px-2.5 rounded-full border font-medium gap-1.5 ${STATUS_COLOR[editedStatus]}`}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {ALL_STATUSES.map((s) => {
                  const Icon = STATUS_ICON[s];
                  return (
                    <SelectItem key={s} value={s} className="text-xs">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[s]}`}
                      >
                        <Icon className="h-3 w-3 shrink-0" />
                        {STATUS_LABEL[s]}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <SheetDescription className="text-xs">
            Creada el {createdAt}
          </SheetDescription>
        </SheetHeader>

        {/* ── Body ───────────────────────────── */}
        <div className="flex-1 overflow-y-auto divide-y">
          {/* Cliente */}
          <div className="px-5 py-4 space-y-3">
            <SectionLabel>Cliente</SectionLabel>

            {customer ? (
              <>
                {/* Identity row */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback className="text-sm font-semibold">
                      {clientInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">
                      {clientName}
                    </p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 mt-1 w-fit cursor-default">
                          {hasAccount ? (
                            <>
                              <UserCheck className="h-3.5 w-3.5 text-green-500" />
                              <span className="text-xs text-green-600">
                                Con cuenta
                              </span>
                            </>
                          ) : (
                            <>
                              <UserX className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Sin cuenta
                              </span>
                            </>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {hasAccount
                          ? "Este cliente tiene acceso al portal de clientes"
                          : "Este cliente no tiene cuenta registrada"}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* Contact actions — solo si tiene teléfono */}
                {customer.phone && (
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a href={`tel:${customer.phone}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            Llamar
                          </Button>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>{customer.phone}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={`https://wa.me/${customer.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full gap-2"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            WhatsApp
                          </Button>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>Abrir en WhatsApp</TooltipContent>
                    </Tooltip>
                  </div>
                )}

                {/* Contact details */}
                <div className="rounded-lg border divide-y text-sm">
                  {/* Teléfono — siempre visible */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground w-14 shrink-0">
                      Teléfono
                    </span>
                    {customer.phone ? (
                      <>
                        <span className="flex-1">{customer.phone}</span>
                        <CopyButton
                          value={customer.phone}
                          tooltip="Copiar teléfono"
                        />
                      </>
                    ) : (
                      <span className="flex-1 text-muted-foreground italic text-xs">
                        Sin número registrado
                      </span>
                    )}
                  </div>
                  {/* Email — siempre visible */}
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground w-14 shrink-0">
                      Email
                    </span>
                    {customer.email ? (
                      <>
                        <span className="flex-1 truncate">
                          {customer.email}
                        </span>
                        <CopyButton
                          value={customer.email}
                          tooltip="Copiar email"
                        />
                      </>
                    ) : (
                      <span className="flex-1 text-muted-foreground italic text-xs">
                        Sin email registrado
                      </span>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Sin cliente asignado
              </p>
            )}
          </div>

          {/* Cita */}
          <div className="px-5 py-4 space-y-3">
            <SectionLabel>Cita</SectionLabel>
            <div className="rounded-lg border divide-y text-sm">
              <div className="flex items-center gap-2.5 px-3 py-2">
                <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground w-16 shrink-0 text-xs">
                  Servicio
                </span>
                <span className="font-medium">
                  {appointment.service?.name ?? "—"}
                </span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2">
                <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground w-16 shrink-0 text-xs">
                  Empleado
                </span>
                {employee ? (
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Avatar className="h-5 w-5 shrink-0">
                      <AvatarImage
                        src={employee.user.pictureFullPath ?? undefined}
                      />
                      <AvatarFallback className="text-[10px] font-medium">
                        {employee.user.firstName[0]}
                        {employee.user.lastName?.[0] ?? ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium leading-tight">
                        {employee.displayName ?? employeeName}
                      </p>
                      {employee.user.email && (
                        <p className="text-xs text-muted-foreground truncate">
                          {employee.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <span className="font-medium">—</span>
                )}
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <Timer className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    Duración
                  </span>
                  <span className="font-medium text-sm ml-auto">
                    {duration}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">Precio</span>
                  <span className="font-medium text-sm ml-auto">{price}</span>
                </div>
              </div>
              {appointment.isGroup && (
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <Users className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground w-16 shrink-0 text-xs">
                    Tipo
                  </span>
                  <span className="font-medium">
                    Grupal
                    {appointment.capacity != null && (
                      <span className="text-muted-foreground ml-1 text-xs">
                        (cap. {appointment.capacity})
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Horario */}
          <div className="px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <SectionLabel>Horario</SectionLabel>
              {!isRescheduling && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1.5 text-xs"
                      onClick={openReschedule}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      Reprogramar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Cambiar fecha y hora de la cita
                  </TooltipContent>
                </Tooltip>
              )}
            </div>

            {isRescheduling ? (
              <div className="rounded-lg border overflow-hidden">
                <div className="flex justify-center border-b bg-muted/30 px-2 py-1">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={(d) => {
                      setRescheduleDate(d);
                      setSelectedSlot(null);
                    }}
                    disabled={{ before: new Date() }}
                  />
                </div>
                <div className="p-3 space-y-2">
                  {rescheduleDate ? (
                    (() => {
                      const durationMinutes =
                        appointment.service?.durationMinutes ?? 60;
                      const slots = getMockSlots(
                        rescheduleDate,
                        employee?.id,
                        durationMinutes
                      );
                      const availableCount = slots.filter(
                        (s) => s.available
                      ).length;
                      return (
                        <>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Disponibilidad · {duration} c/u
                            </p>
                            {availableCount === 0 && (
                              <span className="flex items-center gap-1 text-xs text-destructive">
                                <Ban className="h-3 w-3" />
                                Sin disponibilidad
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-1.5">
                            {slots.map(({ time, available }) => {
                              const isSelected = selectedSlot === time;
                              return (
                                <button
                                  key={time}
                                  disabled={!available}
                                  onClick={() => setSelectedSlot(time)}
                                  className={[
                                    "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                                    available
                                      ? isSelected
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                                      : "cursor-not-allowed border-transparent bg-muted text-muted-foreground line-through opacity-50",
                                  ].join(" ")}
                                >
                                  {formatSlotLabel(time)}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-2">
                      Selecciona una fecha para ver disponibilidad
                    </p>
                  )}
                </div>
                <div className="flex gap-2 border-t bg-background px-3 py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={cancelReschedule}
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    disabled={!rescheduleDate || !selectedSlot}
                    onClick={applyReschedule}
                  >
                    <CalendarClock className="h-3.5 w-3.5" />
                    Aplicar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border divide-y text-sm">
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <CalendarIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground w-16 shrink-0 text-xs">
                    Fecha
                  </span>
                  <span className="font-medium capitalize">
                    {dayStr}, {dateStr}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground w-16 shrink-0 text-xs">
                    Hora
                  </span>
                  <span className="font-medium">
                    {timeStart} – {timeEnd}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="px-5 py-4 space-y-2">
            <SectionLabel>Notas</SectionLabel>
            <Textarea
              placeholder="Agregar observaciones sobre esta cita..."
              value={editedNotes}
              onChange={(e) => {
                setEditedNotes(e.target.value);
                setIsDirty(true);
              }}
              className="resize-none min-h-[80px] text-sm"
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────── */}
        <SheetFooter className="border-t px-5 py-3">
          {isDirty ? (
            <div className="flex w-full items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={handleDiscard}
              >
                Descartar
              </Button>
              <Button size="sm" onClick={handleSave}>
                Guardar cambios
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
