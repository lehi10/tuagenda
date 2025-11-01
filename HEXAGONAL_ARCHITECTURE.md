# Arquitectura Hexagonal - Documentación

## Resumen de Refactorización

Hemos refactorizado con éxito el módulo **User** para seguir el patrón de Arquitectura Hexagonal (Ports & Adapters).

---

## Estructura Creada

```
src/
├── core/                                    # 💛 NÚCLEO - Lógica de negocio
│   ├── domain/                              # Capa de dominio
│   │   ├── entities/
│   │   │   ├── User.ts                     # Entidad de dominio User
│   │   │   └── index.ts
│   │   └── repositories/                    # Puertos (interfaces)
│   │       ├── IUserRepository.ts          # Interface del repositorio
│   │       └── index.ts
│   └── application/                         # Capa de aplicación
│       └── use-cases/
│           └── user/
│               ├── CreateUser.ts           # Caso de uso: Crear usuario
│               ├── GetUser.ts              # Caso de uso: Obtener usuario
│               └── index.ts
│
├── infrastructure/                          # 🔧 INFRAESTRUCTURA - Detalles técnicos
│   ├── repositories/                        # Adaptadores de persistencia
│   │   ├── PrismaUserRepository.ts         # Implementación con Prisma
│   │   └── index.ts
│   └── mappers/                             # Mappers de conversión
│       ├── UserMapper.ts                   # Domain ↔ Prisma
│       └── UserToPrismaType.ts             # Domain → Tipo Prisma
│
└── actions/                                 # 🎨 PRESENTACIÓN - Server Actions
    └── user/
        ├── create-user.action.ts           # ✅ Refactorizado
        └── get-user.action.ts              # ✅ Refactorizado
```

---

## Capas de la Arquitectura

### 1️⃣ **Dominio** (`core/domain`)

**Responsabilidad:** Define las reglas de negocio puras sin dependencias externas.

#### Entidad User (`core/domain/entities/User.ts`)
```typescript
export class User {
  // Propiedades privadas
  private readonly _id: string;
  private _email: string;
  // ... más propiedades

  // Métodos de negocio
  isActive(): boolean { /* ... */ }
  isAdmin(): boolean { /* ... */ }
  block(): void { /* ... */ }
  updateProfile(data): void { /* ... */ }
}
```

**Características:**
- ✅ Encapsulación completa (propiedades privadas)
- ✅ Validaciones en el constructor
- ✅ Lógica de negocio como métodos
- ✅ Inmutabilidad del ID
- ✅ Sin dependencias de infraestructura

#### Puerto: IUserRepository (`core/domain/repositories/IUserRepository.ts`)
```typescript
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<void>;
  // ... más métodos
}
```

**Características:**
- ✅ Define el contrato para persistencia
- ✅ Trabaja con entidades del dominio
- ✅ No especifica implementación

---

### 2️⃣ **Aplicación** (`core/application`)

**Responsabilidad:** Orquesta el flujo de casos de uso.

#### Use Case: CreateUser
```typescript
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository
  ) {}

  async execute(input: unknown): Promise<CreateUserResult> {
    // 1. Validar input (Zod)
    // 2. Verificar si existe
    // 3. Crear entidad de dominio
    // 4. Persistir usando repositorio
    // 5. Retornar resultado
  }
}
```

**Características:**
- ✅ Validación de entrada con Zod
- ✅ Lógica de aplicación (no de dominio)
- ✅ Dependency Injection del repositorio
- ✅ Manejo de errores robusto
- ✅ Logging integrado

#### Use Case: GetUser
Similar estructura, pero enfocado en recuperación.

---

### 3️⃣ **Infraestructura** (`infrastructure`)

**Responsabilidad:** Implementa adaptadores para tecnologías específicas.

#### Adaptador: PrismaUserRepository
```typescript
export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({ where: { id } });
    if (!prismaUser) return null;
    return UserMapper.toDomain(prismaUser);
  }

  async create(user: User): Promise<User> {
    const data = UserMapper.toPrismaCreate(user);
    const created = await prisma.user.create({ data });
    return UserMapper.toDomain(created);
  }
  // ... más implementaciones
}
```

**Características:**
- ✅ Implementa la interface del dominio
- ✅ Usa Prisma para persistencia
- ✅ Convierte entre tipos usando Mappers
- ✅ Maneja filtros complejos

#### Mappers
- **UserMapper:** Convierte entre Prisma models y Domain entities
- **UserToPrismaType:** Convierte Domain entities a tipos Prisma (backward compatibility)

---

### 4️⃣ **Presentación** (`actions`)

**Responsabilidad:** Punto de entrada desde la UI/cliente.

#### Server Action Refactorizado
```typescript
// ANTES (acoplado a Prisma)
export async function createUserInDatabase(data) {
  const user = await prisma.user.create({ data });
  return { success: true, userId: user.id };
}

// DESPUÉS (usa use case)
export async function createUserInDatabase(data) {
  const userRepository = new PrismaUserRepository();
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const result = await createUserUseCase.execute(data);

  if (result.success && result.user) {
    return { success: true, userId: result.user.id };
  }
  return { success: false, error: result.error };
}
```

**Beneficios:**
- ✅ Sin lógica de negocio
- ✅ Solo orquesta dependencias
- ✅ Mantiene compatibilidad de tipos
- ✅ Fácil de testear

---

## Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                        UI / Cliente                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Presentación: Server Actions                                │
│  - createUserInDatabase()                                    │
│  - getUserById()                                             │
└────────────────────┬────────────────────────────────────────┘
                     │ Dependency Injection
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Aplicación: Use Cases                                       │
│  - CreateUserUseCase.execute()                               │
│  - GetUserUseCase.execute()                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ Usa puerto (interface)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Dominio: Repository Interface                               │
│  - IUserRepository                                           │
└────────────────────┬────────────────────────────────────────┘
                     │ Implementado por
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Infraestructura: Adaptadores                                │
│  - PrismaUserRepository                                      │
│  - UserMapper                                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  Base de Datos: PostgreSQL (vía Prisma)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Ventajas Conseguidas

### ✅ Independencia de Infraestructura
- El dominio no conoce Prisma
- Puedes cambiar de Prisma a TypeORM sin tocar el dominio
- Puedes cambiar de PostgreSQL a MongoDB sin tocar casos de uso

### ✅ Testabilidad
```typescript
// Test de use case
const mockRepository: IUserRepository = {
  findById: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockResolvedValue(mockUser),
  // ...
};

const useCase = new CreateUserUseCase(mockRepository);
const result = await useCase.execute(input);

expect(result.success).toBe(true);
expect(mockRepository.create).toHaveBeenCalledTimes(1);
```

### ✅ Mantenibilidad
- Cambios en Prisma solo afectan el adaptador
- Lógica de negocio está centralizada en el dominio
- Use cases son fáciles de entender

### ✅ Escalabilidad
- Fácil agregar nuevos adaptadores (GraphQL, REST API, gRPC)
- Fácil agregar nuevos casos de uso
- Fácil agregar nuevas entidades siguiendo el mismo patrón

### ✅ Separación de Responsabilidades
- **Dominio:** ¿Qué es un User? ¿Qué puede hacer?
- **Aplicación:** ¿Cómo creo un User?
- **Infraestructura:** ¿Dónde guardo el User?
- **Presentación:** ¿Cómo expongo la creación de User?

---

## Compatibilidad con Código Existente

### ✅ Zero Breaking Changes
- Los Server Actions mantienen la misma firma
- El AuthContext sigue funcionando sin cambios
- Los componentes no necesitan modificaciones

### Conversión de Tipos
```typescript
// Domain User → Prisma User (para backward compatibility)
const prismaUser = UserToPrismaType.toPrismaType(domainUser);
```

---

## Próximos Pasos

### 1. Refactorizar más módulos
- [ ] Business (entidad + use cases)
- [ ] Appointment (entidad + use cases)
- [ ] BusinessUser (relación N:N)

### 2. Agregar más use cases para User
- [ ] UpdateUser
- [ ] DeleteUser
- [ ] ListUsers
- [ ] SearchUsers
- [ ] BlockUser / UnblockUser

### 3. Dependency Injection Container
Actualmente usamos DI manual:
```typescript
const repo = new PrismaUserRepository();
const useCase = new CreateUserUseCase(repo);
```

Mejorar con un contenedor:
```typescript
const useCase = container.resolve(CreateUserUseCase);
```

Opciones:
- TSyringe
- InversifyJS
- Awilix
- Custom container

### 4. Testing
Crear tests para:
- [ ] User entity (reglas de negocio)
- [ ] Use cases (con mocks)
- [ ] Repository (integration tests)
- [ ] Mappers

### 5. Documentar patrones
- [ ] Guía para crear nuevas entidades
- [ ] Guía para crear nuevos use cases
- [ ] Guía para crear nuevos adaptadores

---

## Glosario

- **Entidad:** Objeto con identidad única que contiene lógica de negocio
- **Puerto:** Interface que define un contrato (IUserRepository)
- **Adaptador:** Implementación concreta de un puerto (PrismaUserRepository)
- **Use Case:** Orquestación de un flujo de negocio específico
- **Mapper:** Convierte entre tipos de diferentes capas
- **Dependency Injection:** Patrón para inyectar dependencias

---

## Recursos

- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

---

**Fecha de refactorización:** 2025-11-01
**Módulo refactorizado:** User
**Estado:** ✅ Completado y funcionando
