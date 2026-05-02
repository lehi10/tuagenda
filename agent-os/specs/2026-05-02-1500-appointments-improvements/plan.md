# Plan: Mejoras a la página /appointments

## Contexto

La página de citas del dashboard de negocios (`/appointments`) tiene varios problemas:
- La paginación está oculta cuando hay ≤20 citas (condicionada a `totalPages > 1`)
- Los cambios de estado son mock/locales — no persisten al backend
- La hora en la tabla es `text-xs text-muted-foreground`, poco legible
- El diseño visual de las filas puede mejorar
- No hay columnas ordenables
- Las acciones de estado solo están en el dropdown

## Task 1: Spec documentation ✅

## Task 2: Backend — Use case UpdateAppointmentStatus

Crear `UpdateAppointmentStatus.ts` + exportar en `index.ts`

## Task 3: Backend — Mutación tRPC updateStatus

Agregar a `appointment.router.ts`

## Task 4: Frontend — appointment-list.tsx

- Paginación siempre visible con números de página
- Persistir cambios de estado con mutación tRPC
- Mejoras visuales (hora, badges, filas)
- Columnas ordenables (client-side)
- Acciones rápidas inline
