# Appointments Page Improvements — Shaping Notes

## Scope

Mejorar la página `/appointments` del dashboard de negocios con:
1. Paginación siempre visible (actualmente oculta cuando hay ≤20 citas)
2. Cambios de estado persistidos al backend (actualmente son mock locales)
3. Mejor diseño visual de la tabla (hora más legible, badges con color, filas)
4. Columnas ordenables por Nombre, Fecha/Hora, Duración, Precio, Estado
5. Acciones rápidas inline en cada fila para las transiciones de estado más comunes

## Decisions

- El ordenamiento es client-side sobre la página cargada (no server-side), ya que el PAGE_SIZE es 20 y no vale la complejidad adicional de ordenamiento en DB para esta etapa
- La búsqueda sigue siendo client-side sobre la página cargada (misma razón)
- Se agrega un `UpdateAppointmentStatus` use case en lugar de poner la lógica directamente en el router
- Las transiciones de estado se validan en el use case (scheduled→confirmed|cancelled, confirmed→completed|cancelled, etc.)
- Los botones rápidos inline solo muestran la acción "positiva" (Confirmar, Completar); Cancelar sigue en el dropdown para evitar clics accidentales

## Context

- **Visuals:** Ninguno — diseño propuesto por Claude
- **References:** `appointment-list.tsx` existente (refactor del mismo archivo)
- **Product alignment:** N/A (sin product folder)

## Standards Applied

- architecture/trpc-use-case-wiring — nueva mutación sigue el patrón inline de instanciación
- architecture/use-case-result — UpdateAppointmentStatus retorna `{ success, appointment?, error? }`
- trpc/router-structure — mutación agregada al `appointmentRouter` existente
