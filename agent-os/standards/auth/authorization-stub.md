# Authorization — Stub (Not Implemented)

`AuthorizationService.can()` currently returns `true` for all requests. Authorization logic has NOT been implemented yet.

## Current state

```typescript
// packages/auth/src/authorization-service.ts
async can(request: AuthorizationRequest): Promise<boolean> {
  // TODO: Implement your authorization logic
  return true; // ← allows everything
}
```

## What exists (structure only)

- `IAuthorizationPort` — port interface in domain (`src/server/core/domain/ports/`)
- `AuthorizationAdapter` — adapter in infrastructure (`src/server/infrastructure/adapters/`)
- `AuthorizationService` — singleton in `packages/auth/` (stub with TODOs)
- `canUserPerform()` — wrapper in `src/server/lib/auth/authorization.ts`

## What needs to be implemented

- Role-based access per business (`MANAGER`, `EMPLOYEE`)
- Resource + action permission checks (`Resource.SERVICE`, `Action.DELETE`, etc.)
- Logic should query `BusinessUser` table for roles and `User.type` for global permissions

## Rules

- Do NOT assume authorization is enforced — it is not
- Do NOT add `canUserPerform()` calls expecting them to block access (they won't)
- When implementing, follow the `IAuthorizationPort` interface already defined in domain
- Use `AuthorizationRequest { userId, businessId, resource, action }` shape
