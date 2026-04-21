# Calendar Backend Integration — Shaping Notes

## Scope

Conectar la página `/calendar` al backend real, reemplazando los datos mock hardcodeados con una query tRPC al endpoint `getBusinessAppointments`. También se elimina el componente `CalendarStats` que tenía estadísticas hardcodeadas.

## Decisions

- Rango de fechas dinámico: al navegar en FullCalendar, se dispara `datesSet` y se refetch con el nuevo rango
- Se elimina `CalendarStats` completamente (no se reemplaza)
- El tipo UI `Appointment` se actualiza para coincidir con los statuses del backend (`scheduled|confirmed|completed|cancelled`)
- No se necesitan cambios en el backend (use cases, repository, router ya están completos)
- Límite de 100 appointments por query (máximo permitido por el endpoint)

## Context

- **Visuals:** None
- **References:** `appointment-list.tsx` (patrón de query), `appointment-stats.tsx` (patrón de stats)
- **Product alignment:** N/A

## Standards Applied

- Frontend data fetching via tRPC React Query hooks (`useTrpc`)
- Timezone: conversión solo en frontend, backend retorna UTC
