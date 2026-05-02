---
name: Ports and Adapters
description: Naming, location, and structure rules for domain ports and infrastructure adapters
type: standard
---

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
// Repository port
export interface IAppointmentRepository {
  findById(_id: string): Promise<Appointment | null>;
  create(_appointment: Appointment): Promise<Appointment>;
  update(_appointment: Appointment): Promise<Appointment>;
}

// Service port
export interface INotificationSenderPort {
  readonly channel: NotificationChannel;
  send(_request: SendNotificationRequest): Promise<SendNotificationResult>;
}
```

- Parameters use leading underscore (`_id`, `_filters`) — signals interface-only, not implementation
- Methods are async, return domain entities (never Prisma types)

## Adapter Locations

| Type | Folder | Naming |
|---|---|---|
| DB adapter | `infrastructure/repositories/` | `Prisma{Entity}Repository` |
| Service adapter | `infrastructure/adapters/` | `{Service}Adapter` |

```typescript
// Implements repository port
export class PrismaAppointmentRepository implements IAppointmentRepository {
  // No constructor — imports prisma directly
  async findById(id: string): Promise<Appointment | null> { ... }
}

// Implements service port
export class AuthorizationAdapter implements IAuthorizationPort {
  constructor(private readonly authService: AuthorizationService) {}
  async canPerform(request: AuthorizationRequest): Promise<boolean> { ... }
}
```

## Import Rule

- `web-app` tRPC routers import **only** from `core/domain/` (ports) and `core/application/` (use cases)
- Infrastructure adapters are instantiated in routers, never imported by use cases
- External packages (`notifications`, etc.) follow the same split: public barrel exports ports/use-cases, `infrastructure` sub-path exports adapters
