---
sidebar_position: 3
---

# Estructura de Carpetas

## Monorepo

```mermaid
flowchart TB
    Root["tuagenda/"]

    subgraph Apps["apps/"]
        WebApp["web-app/<br/>Next.js 15"]
    end

    subgraph Packages["packages/"]
        DB["db/<br/>Prisma Schema"]
        Auth["auth/<br/>Casbin Rules"]
    end

    subgraph Config["Configuración"]
        PkgJson["package.json"]
        Turbo["turbo.json"]
        PNPM["pnpm-workspace.yaml"]
    end

    Root --> Apps
    Root --> Packages
    Root --> Config

    WebApp -.-> DB
    WebApp -.-> Auth
```

## Web App (apps/web-app/)

```
apps/web-app/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── client/                 # Código del cliente
│   ├── server/                 # Código del servidor
│   └── shared/                 # Código compartido
├── public/                     # Assets estáticos
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### App Router (src/app/)

```mermaid
flowchart TB
    App["app/"]

    subgraph RouteGroups["Route Groups"]
        Marketing["(marketing)/<br/>Páginas públicas"]
        Public["(public)/<br/>Auth pages"]
        Private["(private)/<br/>Dashboard"]
        Booking["(booking)/<br/>Reservas"]
    end

    subgraph API["API"]
        TRPC["api/trpc/"]
    end

    App --> RouteGroups
    App --> API
```

```
src/app/
├── (marketing)/           # Landing, pricing, features
│   ├── page.tsx          # Home
│   ├── about-us/
│   ├── pricing/
│   └── features/
│
├── (public)/              # Autenticación
│   ├── login/
│   ├── signup/
│   └── forgot-password/
│
├── (private)/             # Requiere auth
│   ├── dashboard/
│   ├── calendar/
│   ├── appointments/
│   ├── clients/
│   ├── services/
│   ├── employees/
│   └── settings/
│
├── (booking)/             # Flujo de reservas público
│   └── [slug]/
│
├── api/
│   └── trpc/              # Endpoint tRPC
│
├── layout.tsx             # Root layout
└── globals.css
```

### Client (src/client/)

```mermaid
flowchart TB
    Client["client/"]

    subgraph UI["UI"]
        Components["components/<br/>Primitivos"]
        Features["features/<br/>Módulos"]
    end

    subgraph State["Estado"]
        Contexts["contexts/<br/>Auth, Business"]
        Hooks["hooks/<br/>Custom hooks"]
    end

    subgraph Utils["Utilidades"]
        Lib["lib/<br/>Servicios"]
        Types["types/"]
        Validations["validations/"]
    end

    Client --> UI
    Client --> State
    Client --> Utils
```

```
src/client/
├── components/
│   └── ui/               # Radix UI wrappers
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       └── ...
│
├── features/             # Módulos por dominio
│   ├── appointments/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── types.ts
│   ├── calendar/
│   ├── clients/
│   ├── services/
│   └── employees/
│
├── contexts/
│   ├── auth-context.tsx
│   └── business-context.tsx
│
├── hooks/
│   ├── use-auth.ts
│   ├── use-permission.ts
│   └── use-booking-flow.ts
│
├── lib/
│   ├── auth/             # Firebase client
│   ├── trpc/             # tRPC client
│   └── logger.ts
│
└── validations/          # Zod schemas (client)
```

### Server (src/server/)

```mermaid
flowchart TB
    Server["server/"]

    subgraph Core["core/ (Negocio)"]
        Domain["domain/<br/>Entities, Ports"]
        Application["application/<br/>Use Cases"]
    end

    subgraph Infra["infrastructure/"]
        Repos["repositories/<br/>Prisma impl"]
        Mappers["mappers/"]
    end

    subgraph API["API Layer"]
        Actions["api/<br/>Server Actions"]
        TRPC["trpc/<br/>Routers"]
    end

    Server --> Core
    Server --> Infra
    Server --> API

    API --> Core
    Core --> Infra
```

```
src/server/
├── core/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── User.ts
│   │   │   ├── Business.ts
│   │   │   ├── Service.ts
│   │   │   └── Appointment.ts
│   │   └── repositories/
│   │       ├── IUserRepository.ts
│   │       ├── IBusinessRepository.ts
│   │       └── IAppointmentRepository.ts
│   │
│   └── application/
│       └── use-cases/
│           ├── user/
│           ├── business/
│           ├── service/
│           └── appointment/
│
├── infrastructure/
│   ├── repositories/
│   │   ├── PrismaUserRepository.ts
│   │   └── PrismaBusinessRepository.ts
│   └── mappers/
│       ├── UserMapper.ts
│       └── BusinessMapper.ts
│
├── api/
│   └── authorization/
│       └── check-permission.action.ts
│
└── trpc/
    ├── index.ts
    ├── trpc.ts           # Context & middleware
    ├── server.ts         # Server-side caller
    └── routers/
        ├── app.router.ts # Root router
        ├── user.router.ts
        ├── business.router.ts
        └── appointment.router.ts
```

### Shared (src/shared/)

```
src/shared/
├── types/                # Tipos compartidos
├── validations/          # Zod schemas compartidos
├── utils/                # Funciones utilitarias
├── constants/            # Constantes
└── lib/                  # Librerías compartidas
```

## Packages

### db (packages/db/)

```
packages/db/
├── prisma/
│   ├── schema.prisma     # Schema de la BD
│   └── migrations/       # Migraciones
├── src/
│   └── index.ts          # Export PrismaClient
└── package.json
```

### auth (packages/auth/)

```
packages/auth/
├── src/
│   ├── casbin/
│   │   ├── enforcer.ts   # Casbin enforcer
│   │   └── model.conf    # Casbin model
│   └── index.ts
└── package.json
```

## Convenciones de Nombres

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| Componentes React | PascalCase | `UserProfile.tsx` |
| Server Actions | kebab-case + `.action.ts` | `get-user.action.ts` |
| Hooks | camelCase + `use` prefix | `useAuth.ts` |
| Use Cases | PascalCase | `CreateUser.ts` |
| Repositories | PascalCase + `Repository` | `PrismaUserRepository.ts` |
| Interfaces | `I` prefix + PascalCase | `IUserRepository.ts` |
| Mappers | PascalCase + `Mapper` | `UserMapper.ts` |
| Schemas Zod | kebab-case + `.schema.ts` | `user.schema.ts` |
