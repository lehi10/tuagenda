# Type Safety: Eliminando `any` de la Arquitectura Hexagonal

## El Problema Original

Al implementar arquitectura hexagonal, encontramos un conflicto de tipos:

```typescript
// ❌ Problema: Usábamos 'any' para convertir tipos
where.status = filters.status as any;  // 🚨 Pérdida de type safety
where.type = filters.type as any;      // 🚨 Pérdida de type safety
```

## ¿Por qué había `any`?

### Conflicto de Tipos

```typescript
// Dominio (core/domain/entities/User.ts)
export enum UserStatus {
  HIDDEN = "hidden",
  VISIBLE = "visible",
  DISABLED = "disabled",
  BLOCKED = "blocked",
}

// Prisma (generado automáticamente)
export enum UserStatus {
  hidden = "hidden",
  visible = "visible",
  disabled = "disabled",
  blocked = "blocked",
}
```

TypeScript ve estos como **tipos diferentes**, aunque los valores string sean idénticos.

## Opciones Evaluadas

### ❌ Opción Rechazada: EnumMapper
```typescript
class EnumMapper {
  static domainStatusToPrisma(status: DomainUserStatus): PrismaUserStatus {
    const mapping = {
      [DomainUserStatus.HIDDEN]: PrismaUserStatus.hidden,
      // ... más mappings
    };
    return mapping[status];
  }
}
```

**Rechazada porque:**
- ✗ Complejidad innecesaria
- ✗ Más código que mantener
- ✗ Si agregas un nuevo status, hay que actualizar el mapper
- ✗ Los valores son idénticos, no necesitamos lógica de conversión

### ✅ Solución Adoptada: Type Assertion Pragmática

```typescript
// Domain enums use same string values as Prisma
if (filters.status) {
  if (Array.isArray(filters.status)) {
    where.status = {
      in: filters.status as unknown as PrismaUserStatus[],
    };
  } else {
    where.status = filters.status as unknown as PrismaUserStatus;
  }
}
```

## ¿Por qué esta solución es correcta?

### 1. Mantiene Type Safety
```typescript
// ✅ TypeScript sabe que es PrismaUserStatus
where.status = filters.status as unknown as PrismaUserStatus;

// Si intentas usar un valor incorrecto, TypeScript te alertará:
const status: UserStatus = "invalid";  // ❌ Error en tiempo de compilación
```

### 2. Es Explícita
```typescript
// ❌ MAL: 'any' oculta el problema
as any

// ✅ BIEN: 'as unknown as' deja claro que estás haciendo una conversión consciente
as unknown as PrismaUserStatus
```

### 3. Es Pragmática
Los valores son **idénticos**:
- DomainUserStatus.VISIBLE = `"visible"`
- PrismaUserStatus.visible = `"visible"`

No hay lógica de conversión, solo un problema de tipos.

### 4. Es Mantenible
Si agregas un nuevo status:
```typescript
// 1. Agregas al enum del dominio
export enum UserStatus {
  HIDDEN = "hidden",
  VISIBLE = "visible",
  DISABLED = "disabled",
  BLOCKED = "blocked",
  PENDING = "pending",  // ✅ Nuevo
}

// 2. Agregas a Prisma schema
enum UserStatus {
  hidden
  visible
  disabled
  blocked
  pending  // ✅ Nuevo
}

// 3. ¡Listo! El código del repositorio sigue funcionando
// No necesitas actualizar mappers ni nada más
```

## Dónde se Aplica

### ✅ En el Repositorio (Adaptador)
```typescript
export class PrismaUserRepository implements IUserRepository {
  async findAll(filters?: UserRepositoryFilters): Promise<User[]> {
    // ✅ AQUÍ: El adaptador convierte entre tipos
    where.status = filters.status as unknown as PrismaUserStatus;
  }
}
```

**Por qué aquí:** El repositorio es el ADAPTADOR. Su trabajo es traducir entre el dominio y la infraestructura.

### ❌ NO en el Dominio
```typescript
// core/domain/entities/User.ts
export class User {
  // ❌ NUNCA importar tipos de Prisma aquí
  private _status: PrismaUserStatus;  // ❌ NO HACER ESTO

  // ✅ Usar enums del dominio
  private _status: UserStatus;  // ✅ Correcto
}
```

### ❌ NO en los Use Cases
```typescript
// core/application/use-cases/user/CreateUser.ts
export class CreateUserUseCase {
  async execute(input: unknown): Promise<CreateUserResult> {
    // ✅ Solo usa tipos del dominio
    const user = new User({
      status: UserStatus.VISIBLE,  // ✅ Enum del dominio
    });

    // ❌ NUNCA usar tipos de Prisma
    // status: PrismaUserStatus.visible  // ❌ NO
  }
}
```

## Independencia del Dominio

Esta solución mantiene la independencia porque:

### 1. El Dominio NO conoce Prisma
```typescript
// ✅ core/domain/entities/User.ts
// NO importa nada de @prisma/client
export enum UserStatus { ... }
export class User { ... }
```

### 2. Los Use Cases NO conocen Prisma
```typescript
// ✅ core/application/use-cases/user/CreateUser.ts
// NO importa nada de @prisma/client
constructor(private readonly userRepository: IUserRepository) {}
```

### 3. SOLO el Adaptador conoce Prisma
```typescript
// ✅ infrastructure/repositories/PrismaUserRepository.ts
import { Prisma, UserStatus as PrismaUserStatus } from "@prisma/client";
// ✅ Aquí SÍ puede importar Prisma, es su trabajo
```

## Cambiar de Prisma a otro ORM

Si mañana quieres cambiar a TypeORM:

```typescript
// 1. Creas nuevo adaptador
export class TypeORMUserRepository implements IUserRepository {
  async findAll(filters?: UserRepositoryFilters): Promise<User[]> {
    // Aquí usarías: as unknown as TypeORMUserStatus
    where.status = filters.status as unknown as TypeORMUserStatus;
  }
}

// 2. Cambias la inyección de dependencias
// ANTES:
const repo = new PrismaUserRepository();

// DESPUÉS:
const repo = new TypeORMUserRepository();

// 3. El dominio y use cases NO CAMBIAN
// ✅ Cero cambios en core/domain
// ✅ Cero cambios en core/application
```

## Patrón: `as unknown as`

### ¿Por qué `as unknown as` y no solo `as`?

```typescript
// ❌ TypeScript no permite conversión directa entre enums
const status = domainStatus as PrismaUserStatus;  // ❌ Error

// ✅ 'unknown' es un tipo de escape seguro
const status = domainStatus as unknown as PrismaUserStatus;  // ✅ OK
```

**Es más seguro que `any` porque:**
- `any` desactiva TODAS las verificaciones de tipo
- `unknown` requiere que seas explícito sobre la conversión

```typescript
// Con 'any' - PELIGROSO
const x: any = 123;
x.toUpperCase();  // ✅ Compila, ❌ Explota en runtime

// Con 'unknown' - SEGURO
const x: unknown = 123;
x.toUpperCase();  // ❌ Error en compilación
if (typeof x === 'string') {
  x.toUpperCase();  // ✅ OK
}
```

## Checklist de Type Safety

Al escribir código en este proyecto:

### ✅ Dominio (core/domain)
- [ ] NO usa `any`
- [ ] NO importa `@prisma/client`
- [ ] Solo usa sus propios tipos y enums

### ✅ Aplicación (core/application)
- [ ] NO usa `any`
- [ ] NO importa `@prisma/client`
- [ ] Solo usa interfaces del dominio

### ✅ Infraestructura (infrastructure)
- [ ] NO usa `any` (usa `as unknown as` cuando sea necesario)
- [ ] SÍ puede importar `@prisma/client`
- [ ] Convierte entre tipos del dominio y Prisma

### ✅ Presentación (actions)
- [ ] NO usa `any`
- [ ] NO importa `@prisma/client`
- [ ] Solo usa use cases

## Resumen

| Criterio | `any` | `as unknown as` |
|----------|-------|-----------------|
| Type safety | ❌ Ninguna | ✅ Parcial |
| Explícito | ❌ No | ✅ Sí |
| Intención clara | ❌ No | ✅ Sí |
| Catch errors | ❌ No | ✅ En algunos casos |
| Recomendado | ❌ Nunca | ✅ Para conversiones pragmáticas |

## Conclusión

La solución `as unknown as PrismaUserStatus`:

✅ Es pragmática (los valores son idénticos)
✅ Es explícita (muestra intención)
✅ Es mantenible (agregar enums no requiere cambios)
✅ Mantiene independencia del dominio
✅ Es más segura que `any`
✅ Solo se usa en el adaptador (donde debe estar)

---

**Última actualización:** 2025-11-01
**Patrón establecido:** `as unknown as` para conversiones enum en adaptadores
**Estado:** ✅ Sin `any` en el código
