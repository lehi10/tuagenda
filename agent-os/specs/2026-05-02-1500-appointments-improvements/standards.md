# Standards for Appointments Page Improvements

The following standards apply to this work.

---

## architecture/trpc-use-case-wiring

tRPC routers act as the composition root. Repositories and use cases are instantiated inline inside each procedure handler.

**Pattern:**
```typescript
updateStatus: businessMemberProcedure
  .input(z.object({ appointmentId: z.string().uuid(), status: z.enum([...]) }))
  .mutation(async ({ ctx, input }) => {
    const appointmentRepository = new PrismaAppointmentRepository();
    const updateStatusUseCase = new UpdateAppointmentStatusUseCase(appointmentRepository);
    const result = await updateStatusUseCase.execute({ ... });
    if (!result.success || !result.appointment) {
      throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
    }
    return result.appointment.toObject();
  })
```

Rules: No global DI container. Always `.toObject()` before returning entity. Only the router imports from `infrastructure/repositories/`.

---

## architecture/use-case-result

Always use a Result wrapper — no exceptions. Never return the entity directly, never throw from a use case.

**Structure:**
```typescript
export interface UpdateAppointmentStatusResult {
  success: boolean;
  appointment?: Appointment;
  error?: string;
}
```

Rules: `success: false` must always include `error: string`. The use case never throws — the caller (router) decides the TRPCError code.

---

## trpc/router-structure

One router per domain entity, all merged in `app.router.ts`. The `updateStatus` mutation is added to the existing `appointmentRouter` in `appointment.router.ts`.
