import type { Appointment, CalendarEvent } from "../types/appointment";

/**
 * Get color based on appointment status
 */
export function getStatusColor(status: Appointment["status"]) {
  const colors = {
    pending: {
      backgroundColor: "#3b82f6",
      borderColor: "#2563eb",
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

  return colors[status] || colors.pending;
}

/**
 * Convert Appointment to FullCalendar event
 */
export function appointmentToEvent(appointment: Appointment): CalendarEvent {
  const colors = getStatusColor(appointment.status);

  return {
    id: appointment.id,
    title: `${appointment.client} - ${appointment.service}`,
    start: appointment.start,
    end: appointment.end,
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
