# Calendar Feature

This feature provides a comprehensive calendar system for managing appointments using FullCalendar.

## Structure

```
calendar/
├── components/          # Reusable calendar components
│   ├── appointments-calendar.tsx    # Main calendar wrapper with Card UI
│   ├── full-calendar.tsx           # Base FullCalendar component
│   ├── calendar-stats.tsx          # Statistics display
│   ├── calendar-view.tsx           # Simple date picker view
│   └── day-appointments.tsx        # List of appointments for a day
├── types/              # TypeScript type definitions
│   └── appointment.ts  # Appointment and CalendarEvent types
├── utils/              # Utility functions
│   └── event-adapter.ts # Convert appointments to calendar events
└── styles/             # CSS styles
    └── calendar.css    # FullCalendar custom styles

```

## Components

### AppointmentsCalendar

A high-level component that combines FullCalendar with your design system.

**Props:**

- `title` - Calendar card title
- `appointments` - Array of appointments to display
- `onAppointmentClick` - Callback when an appointment is clicked
- `onDateRangeSelect` - Callback when a date range is selected
- `initialView` - Initial calendar view (default: "dayGridMonth")
- `locale` - Calendar locale (default: "en")

**Example:**

```tsx
import { AppointmentsCalendar } from "@/features/calendar/components";
import type { Appointment } from "@/features/calendar/types";

function MyPage() {
  const appointments: Appointment[] = [...];

  return (
    <AppointmentsCalendar
      title="My Appointments"
      appointments={appointments}
      onAppointmentClick={(apt) => console.log('Clicked:', apt)}
      onDateRangeSelect={(start, end) => console.log('Selected:', start, end)}
    />
  );
}
```

### FullCalendarView

A lower-level component that wraps FullCalendar with sensible defaults.

**Props:**

- `events` - Array of CalendarEvent objects
- `initialView` - Initial view ("dayGridMonth" | "timeGridWeek" | "timeGridDay")
- `onEventClick` - Event click handler
- `onDateSelect` - Date selection handler
- `selectable` - Enable date selection (default: true)
- `weekends` - Show weekends (default: true)
- `height` - Calendar height (default: "auto")
- `headerToolbar` - Custom toolbar configuration
- `firstDay` - First day of week (0=Sunday)
- `locale` - Calendar locale

**Example:**

```tsx
import { FullCalendarView } from "@/features/calendar/components";
import { appointmentsToEvents } from "@/features/calendar/utils";

function CustomCalendar() {
  const events = appointmentsToEvents(appointments);

  return (
    <FullCalendarView
      events={events}
      initialView="timeGridWeek"
      onEventClick={(info) => alert(info.event.title)}
    />
  );
}
```

## Types

### Appointment

```typescript
interface Appointment {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  client: string;
  service: string;
  employee: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
  description?: string;
}
```

### CalendarEvent

```typescript
interface CalendarEvent {
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
```

## Utilities

### appointmentToEvent

Converts a single Appointment to a CalendarEvent with appropriate colors based on status.

```typescript
import { appointmentToEvent } from "@/features/calendar/utils";

const event = appointmentToEvent(appointment);
```

### appointmentsToEvents

Converts an array of Appointments to CalendarEvents.

```typescript
import { appointmentsToEvents } from "@/features/calendar/utils";

const events = appointmentsToEvents(appointments);
```

### getStatusColor

Returns color scheme for appointment status.

```typescript
import { getStatusColor } from "@/features/calendar/utils";

const colors = getStatusColor("pending");
// Returns: { backgroundColor, borderColor, textColor }
```

## Customization

### Styling

Edit `src/features/calendar/styles/calendar.css` to customize the calendar appearance.

### Adding New Views

FullCalendar supports additional plugins:

- `@fullcalendar/list` - List view
- `@fullcalendar/multimonth` - Multiple months view
- `@fullcalendar/timeline` - Timeline view

Install and add to the plugins array in `full-calendar.tsx`.

## Next Steps

1. Add appointment creation modal
2. Implement drag-and-drop rescheduling
3. Add filtering by employee/service
