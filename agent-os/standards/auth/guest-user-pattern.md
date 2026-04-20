# Guest User Pattern

Users can book appointments without creating an account. Guest users are stored in the `User` table with `isGuest: true`.

## Differences from registered users

| Field | Registered | Guest |
|-------|-----------|-------|
| `id` | Firebase UID | UUID (generated) |
| `isGuest` | `false` | `true` |
| `guestCreatedAt` | `null` | timestamp |
| `convertedAt` | `null` | set on conversion |

## Creation flow (booking)

```typescript
// publicProcedure — no auth required
api.user.createGuest.mutate({ email, firstName, lastName, phone })

// CreateGuestUserUseCase behavior:
// 1. If guest with same email exists → return existing user (no duplicate)
// 2. If registered user with same email exists → throw error
// 3. Otherwise → create new guest with UUID id and isGuest: true
```

## Conversion to registered user

```typescript
// On the domain entity
user.convertToRegistered(firebaseUid);
// Sets isGuest: false, convertedAt: new Date()
// Note: the ID change (UUID → Firebase UID) must be handled at repository level
```

## Rules

- Guest users use UUID as `id`, not Firebase UID
- `createGuest` is a `publicProcedure` — accessible without authentication
- Same email = same guest user (idempotent creation)
- A guest cannot have the same email as a registered user
- Use `user.isGuestUser()` / `user.isRegisteredUser()` to check in domain logic
