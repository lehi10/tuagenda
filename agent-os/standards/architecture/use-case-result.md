# Use Case Result Shape

Every use case returns a result object. Never throw exceptions — errors are returned as values.

## Structure

```typescript
export interface CreateUserResult {
  success: boolean;
  user?: User;       // present when success: true
  error?: string;    // present when success: false
}

export class CreateUserUseCase {
  async execute(input: CreateUserInput): Promise<CreateUserResult> {
    try {
      // business logic...
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Caller pattern (tRPC router)

```typescript
const result = await createUserUseCase.execute(input);

if (!result.success || !result.user) {
  throw new TRPCError({ code: "BAD_REQUEST", message: result.error });
}

return result.user.toObject();
```

## Rules

- Always define a typed `XResult` interface per use case
- `success: false` must always include `error: string`
- `success: true` must always include the expected data field
- The use case never throws — the caller (router) decides how to surface the error
- The router chooses the appropriate `TRPCError` code based on context
