# Mapper Convention

Mappers translate between Prisma models and domain entities. All methods are static.

## Location

`src/server/infrastructure/mappers/XMapper.ts` — one mapper per entity.

## Methods

```typescript
export class UserMapper {
  // Prisma model → Domain entity (full)
  static toDomain(prismaUser: PrismaUser): User { ... }

  // Domain entity → Prisma create data (omits auto-generated fields like createdAt)
  static toPrismaCreate(user: User) { ... }

  // Domain entity → Prisma update data (omits id and createdAt, includes updatedAt)
  static toPrismaUpdate(user: User) { ... }

  // Convenience: array of Prisma models → array of domain entities
  static toDomainList(prismaUsers: PrismaUser[]): User[] {
    return prismaUsers.map((u) => this.toDomain(u));
  }
}
```

## Rules

- `toDomain`: always returns a complete domain entity
- `toPrismaCreate`: omits `createdAt` and `updatedAt` (Prisma generates them)
- `toPrismaUpdate`: omits `id` (goes in `where`) and `createdAt` (never changes), sets `updatedAt: new Date()`
- Never put Prisma logic inside repositories directly — always go through the mapper
- Never put domain logic inside mappers — mappers only translate, never decide
