import type { Appointment, CalendarEvent } from "../types/appointment";
import type { Appointment as DomainAppointment } from "@/server/core/domain/entities/Appointment";

/**
 * Get color based on appointment status
 */
export function getStatusColor(status: Appointment["status"]) {
  const colors: Record<
    Appointment["status"],
    { backgroundColor: string; borderColor: string; textColor: string }
  > = {
    scheduled: {
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
      textColor: "#ffffff",
    },
    confirmed: {
      backgroundColor: "#8b5cf6",
      borderColor: "#7c3aed",
      textColor: "#ffffff",
    },
    completed: {
      backgroundColor: "#10b981",
      borderColor: "#059669",
      textColor: "#ffffff",
    },
    cancelled: {
      backgroundColor: "#ef4444",
      borderColor: "#dc2626",
      textColor: "#ffffff",
    },
  };

  return colors[status] ?? colors.scheduled;
}

/**
 * Convert Appointment to FullCalendar event
 */
export function appointmentToEvent(appointment: Appointment): CalendarEvent {
  const colors = getStatusColor(appointment.status);

  const toIso = (d: Date | string) => (d instanceof Date ? d.toISOString() : d);

  return {
    id: appointment.id,
    title: `${appointment.client} - ${appointment.service}`,
    start: toIso(appointment.start),
    end: toIso(appointment.end),
    ...colors,
    extendedProps: {
      client: appointment.client,
      service: appointment.service,
      employee: appointment.employee,
      status: appointment.status,
      description: appointment.description,
    },
  };
}

/**
 * Convert multiple appointments to FullCalendar events
 */
export function appointmentsToEvents(
  appointments: Appointment[]
): CalendarEvent[] {
  return appointments.map(appointmentToEvent);
}

/**
 * Map a backend domain Appointment entity to the UI Appointment type
 */
export function domainAppointmentToUIAppointment(
  apt: DomainAppointment
): Appointment {
  const client = apt.customer
    ? `${apt.customer.firstName} ${apt.customer.lastName || ""}`.trim()
    : "N/A";
  const service = apt.service?.name ?? "N/A";
  const employee = apt.providerBusinessUser?.user
    ? `${apt.providerBusinessUser.user.firstName} ${apt.providerBusinessUser.user.lastName || ""}`.trim()
    : "N/A";

  return {
    id: apt.id!,
    title: `${service} - ${client}`,
    start: apt.startTime,
    end: apt.endTime,
    client,
    service,
    employee,
    status: apt.status,
    description: apt.notes ?? undefined,
  };
}
