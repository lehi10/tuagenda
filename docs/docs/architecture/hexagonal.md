---
sidebar_position: 2
---

# Arquitectura Hexagonal

## Concepto

La arquitectura hexagonal (Ports & Adapters) aísla la lógica de negocio de los detalles técnicos.

```mermaid
flowchart TB
    subgraph External["Adaptadores Externos"]
        UI["UI (React)"]
        API["API (tRPC)"]
        DB[(Base de Datos)]
        Auth["Firebase"]
    end

    subgraph Ports["Puertos"]
        InPort["Puertos de Entrada<br/>(Use Cases)"]
        OutPort["Puertos de Salida<br/>(Interfaces)"]
    end

    subgraph Core["Núcleo"]
        Domain["Dominio<br/>(Entities)"]
        App["Aplicación<br/>(Use Cases)"]
    end

    UI --> InPort
    API --> InPort
    InPort --> App
    App --> Domain
    App --> OutPort
    OutPort --> DB
    OutPort --> Auth

    style Core fill:#e1f5fe
    style Ports fill:#fff3e0
```

## Estructura de Carpetas

```
src/server/core/
├── domain/
│   ├── entities/
│   │   ├── User.ts
│   │   ├── Business.ts
│   │   ├── Service.ts
│   │   └── Appointment.ts
│   └── repositories/
│       ├── IUserRepository.ts
│       ├── IBusinessRepository.ts
│       ├── IServiceRepository.ts
│       └── IAppointmentRepository.ts
│
└── application/
    └── use-cases/
        ├── user/
        │   ├── CreateUser.ts
        │   └── GetUser.ts
        ├── business/
        │   ├── CreateBusiness.ts
        │   └── UpdateBusiness.ts
        └── appointment/
            ├── CreateAppointment.ts
            └── GetAppointments.ts
```

## Capas en Detalle

### 1. Dominio (Entities)

Las entidades representan conceptos de negocio puros, sin dependencias técnicas.

```typescript
// src/server/core/domain/entities/User.ts
export interface User {
  id: string;          // Firebase UID
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  type: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export type UserStatus = 'hidden' | 'visible' | 'disabled' | 'blocked';
export type UserType = 'customer' | 'admin' | 'superadmin';
```

```mermaid
classDiagram
    class User {
        +string id
        +string email
        +string firstName
        +string lastName
        +UserStatus status
        +UserType type
        +Date createdAt
    }

    class Business {
        +string id
        +string title
        +string slug
        +BusinessStatus status
        +string timeZone
    }

    class Appointment {
        +string id
        +string customerId
        +string providerId
        +DateTime startTime
        +AppointmentStatus status
    }

    User "1" -- "*" Appointment : reserva
    Business "1" -- "*" Appointment : recibe
```

### 2. Puertos (Interfaces)

Los puertos definen contratos que la infraestructura debe implementar.

```typescript
// src/server/core/domain/repositories/IUserRepository.ts
export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
}
```

```mermaid
flowchart LR
    subgraph Ports["Puertos (Interfaces)"]
        IUser["IUserRepository"]
        IBusiness["IBusinessRepository"]
        IService["IServiceRepository"]
    end

    subgraph Adapters["Adaptadores (Implementaciones)"]
        PUser["PrismaUserRepository"]
        PBusiness["PrismaBusinessRepository"]
        PService["PrismaServiceRepository"]
    end

    PUser -.->|implementa| IUser
    PBusiness -.->|implementa| IBusiness
    PService -.->|implementa| IService
```

### 3. Aplicación (Use Cases)

Los casos de uso orquestan la lógica de negocio.

```typescript
// src/server/core/application/use-cases/user/CreateUser.ts
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<User> {
    // 1. Validar que no exista
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('User already exists');
    }

    // 2. Crear usuario
    return this.userRepository.create({
      ...input,
      status: 'hidden',
      type: 'customer',
    });
  }
}
```

```mermaid
sequenceDiagram
    participant A as Server Action
    participant UC as CreateUserUseCase
    participant R as IUserRepository
    participant DB as Database

    A->>UC: execute(input)
    UC->>R: findByEmail(email)
    R->>DB: SELECT * FROM users
    DB-->>R: null (no existe)
    R-->>UC: null
    UC->>R: create(userData)
    R->>DB: INSERT INTO users
    DB-->>R: user created
    R-->>UC: User entity
    UC-->>A: User entity
```

### 4. Infraestructura (Adapters)

Los adaptadores implementan los puertos usando tecnologías específicas.

```typescript
// src/server/infrastructure/repositories/PrismaUserRepository.ts
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: UserMapper.toPrisma(input),
    });
    return UserMapper.toDomain(user);
  }
}
```

## Mappers

Los mappers convierten entre modelos de dominio y modelos de Prisma.

```mermaid
flowchart LR
    subgraph Domain["Dominio"]
        DE["User Entity"]
    end

    subgraph Mapper["Mapper"]
        TD["toDomain()"]
        TP["toPrisma()"]
    end

    subgraph Prisma["Prisma"]
        PM["Prisma Model"]
    end

    PM --> TD --> DE
    DE --> TP --> PM
```

```typescript
// src/server/infrastructure/mappers/UserMapper.ts
export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      firstName: prismaUser.firstName,
      lastName: prismaUser.lastName,
      status: prismaUser.status as UserStatus,
      type: prismaUser.type as UserType,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
    };
  }

  static toPrisma(user: CreateUserInput): Prisma.UserCreateInput {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
```

## Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Testabilidad** | Mockear repositorios fácilmente |
| **Mantenibilidad** | Lógica centralizada en Use Cases |
| **Flexibilidad** | Cambiar Prisma por otro ORM sin afectar negocio |
| **Claridad** | Separación clara de responsabilidades |

## Anti-patrones a Evitar

```mermaid
flowchart TB
    subgraph Bad["Incorrecto"]
        UC1["Use Case"]
        Prisma1["prisma.user.create()"]
        UC1 --> Prisma1
    end

    subgraph Good["Correcto"]
        UC2["Use Case"]
        Port["IUserRepository"]
        Repo["PrismaUserRepository"]
        UC2 --> Port
        Repo -.->|implementa| Port
    end
```

- ❌ Usar Prisma directamente en Use Cases
- ❌ Exponer modelos de Prisma a la UI
- ❌ Lógica de negocio en controladores/actions
- ✅ Usar interfaces (ports) para abstraer infraestructura
- ✅ Mapear entre capas con Mappers
- ✅ Mantener Use Cases puros y testeables
