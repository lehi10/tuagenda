/**
 * Appointment type definition
 */
export interface Appointment {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  client: string;
  service: string;
  employee: string;
  status: "pending" | "completed" | "cancelled";
  description?: string;
}

/**
 * FullCalendar event type
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    client: string;
    service: string;
    employee: string;
    status: string;
    description?: string;
  };
}
