# Auth Service Interface

Client-side auth is accessed through a singleton behind `IAuthService`. Firebase is the current implementation but the interface allows swapping providers without touching the rest of the code.

## Usage

```typescript
// Always use authService — never import FirebaseAuthService directly
import { authService } from "@/shared/lib/auth/auth-service";

await authService.signIn({ email, password });
await authService.signInWithGoogle();
await authService.signOut();
const token = await authService.getIdToken(); // use for tRPC requests
```

## Key files

- `src/shared/types/auth.ts` — `IAuthService` interface definition
- `src/shared/lib/auth/auth-service.ts` — singleton `getAuthService()` + `authService` convenience object
- `src/client/lib/auth/firebase/firebase-auth-service.ts` — Firebase implementation

## Rules

- Never import `FirebaseAuthService` directly in components or hooks — always use `authService`
- `authService` methods return `FirebaseUserData`, not the full app `User` entity
- After sign-in, fetch the full user from the DB via `api.user.me` to get the domain `User`
- The singleton is instantiated lazily on first call to `getAuthService()`
- Note: swapping Firebase for another provider is architecturally possible but not planned
