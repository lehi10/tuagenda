# Standards for Notification System

The following standards apply to this work.

---

## architecture/ports-and-adapters

# Ports and Adapters

## Port Locations

| Type | Folder | Naming |
|---|---|---|
| Persistence (DB) | `core/domain/repositories/` | `I{Entity}Repository` |
| External service | `core/domain/ports/` | `I{Service}Port` |

**Rule:** Every interface uses the `I` prefix — no exceptions.

```
core/domain/repositories/IAppointmentRepository.ts  ← DB access
core/domain/ports/IAuthorizationPort.ts              ← external service
core/domain/ports/INotificationQueuePort.ts          ← external service
```

## Port Interface Pattern

```typescript
// Service port
export interface INotificationSenderPort {
  readonly channel: NotificationChannel;
  send(_request: SendNotificationRequest): Promise<SendNotificationResult>;
}
```

- Parameters use leading underscore (`_id`, `_filters`) — signals interface-only
- Methods are async, return domain types (never Prisma types)

## Adapter Locations

| Type | Folder | Naming |
|---|---|---|
| Service adapter | `infrastructure/adapters/` | `{Service}Adapter` |

## Import Rule

- `web-app` tRPC routers import **only** from `core/domain/` (ports) and `core/application/` (use cases)
- External packages follow the same split: public barrel exports ports/use-cases, `infrastructure` sub-path exports adapters

---

## architecture/use-case-result

# Use Case Result Shape

**Always use a Result wrapper — no exceptions.** Never return the entity directly (`Promise<Entity>`), never throw from a use case.

```typescript
export interface EnqueueAppointmentNotificationResult {
  success: boolean;
  error?: string;
}

export class EnqueueAppointmentNotificationUseCase {
  async execute(input: EnqueueAppointmentNotificationInput): Promise<EnqueueAppointmentNotificationResult> {
    try {
      await this.queue.enqueue(payload);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Rules

- Always define a typed `XResult` interface per use case
- `success: false` must always include `error: string`
- The use case never throws — the caller (router) decides how to surface the error

---

## architecture/trpc-use-case-wiring

# tRPC-to-UseCase Wiring

tRPC routers act as the composition root. Dependencies instantiated inline per request.

```typescript
// After createAppointmentUseCase.execute(...)
try {
  const queueAdapter = new BullMQNotificationQueueAdapter();
  const enqueueUseCase = new EnqueueAppointmentNotificationUseCase(queueAdapter);
  await enqueueUseCase.execute({ event: 'appointment.created', appointment });
} catch (e) {
  console.error('[notifications] Failed to enqueue:', e);
}
```

## Rules

- Instantiate dependencies inline — no global DI container
- Notification enqueue wrapped in separate try/catch — never fail the booking if Redis fails
- The router is the only layer allowed to import from `infrastructure/`

---

## architecture/mapper-convention

Not directly applicable — no new Prisma entity. The `NotificationJobPayload` is a plain TypeScript interface built from existing domain entities, not a Prisma model.
