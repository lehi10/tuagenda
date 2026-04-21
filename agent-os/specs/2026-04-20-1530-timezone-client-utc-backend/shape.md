# Timezone Support — Shaping Notes

## Scope

Implementar soporte de timezones en el cliente mientras el backend se mantiene UTC-only. El bug actual: los slots de disponibilidad se generan en el timezone del servidor (UTC), pero el cliente construye fechas usando `setHours()` en el timezone del browser, causando un desajuste cuando el negocio está en un timezone distinto al del usuario.

## Decisions

- Un solo módulo de utilidades en el cliente (`timezone-utils.ts`) como single source of truth para toda la lógica de timezone
- `useTimezone` hook: auto-detecta timezone del browser, permite override manual persistido en localStorage
- Backend solo recibe y devuelve UTC (Prisma/PostgreSQL ya manejan esto correctamente)
- `getAvailableTimeSlots` incluirá `businessTimezone` en el response para que el cliente sepa en qué timezone interpretar los slots "HH:mm"
- Instalación de `date-fns-tz` (complemento de `date-fns` ya instalado)
- Los datos hardcodeados de timezone en `business-form-dialog.tsx` se centralizan en `SUPPORTED_TIMEZONES`

## Context

- **Visuals:** Selector de timezone en el flujo de booking (time-slot-selection step)
- **References:** `business-form-dialog.tsx` (selector existente), `payment-step.tsx` (construcción de fecha actual)
- **Product alignment:** N/A (no hay product docs)

## Bug Found

`payment-step.tsx` líneas 82-99: `startTime.setHours(hours, minutes, 0, 0)` usa el timezone del browser. Si el negocio es EST y el usuario está en PST, un slot "09:00 EST" se guarda como 9 AM PST (= 5 PM UTC) en lugar de 9 AM EST (= 2 PM UTC).

## Standards Applied

- `trpc/superjson-transformer` — Dates sobreviven serialización; no convertir manualmente. El backend retorna `Date` UTC, llegan como `Date` en el cliente.
- `architecture/trpc-use-case-wiring` — Al modificar el use case, inyectar repositorios inline en el router.
- `trpc/router-structure` — Un router por entidad; el cambio va en `businessUser.router.ts`.
