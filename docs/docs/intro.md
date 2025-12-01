---
slug: /
sidebar_position: 1
---

# TuAgenda

Sistema de gestión de citas y reservas multi-tenant.

## Visión General

```mermaid
flowchart TB
    subgraph Clients["Clientes"]
        Web["Web App<br/>(Next.js 15)"]
        Mobile["Mobile App<br/>(Futuro)"]
    end

    subgraph Backend["Backend"]
        API["tRPC API"]
        Actions["Server Actions"]
        Auth["Firebase Auth"]
        Casbin["Casbin RBAC"]
    end

    subgraph Data["Datos"]
        DB[(PostgreSQL)]
        Prisma["Prisma ORM"]
    end

    Web --> API
    Web --> Actions
    Web --> Auth
    Mobile -.-> API

    API --> Casbin
    Actions --> Casbin
    Casbin --> Prisma
    Prisma --> DB
```

## Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 15, React 19, Tailwind CSS v4 |
| **UI Components** | Radix UI, Lucide Icons |
| **Forms** | React Hook Form + Zod |
| **Data Fetching** | TanStack Query + tRPC |
| **Backend** | Next.js Server Actions, tRPC |
| **Auth** | Firebase Authentication |
| **Authorization** | Casbin (RBAC/ABAC) |
| **Database** | PostgreSQL + Prisma ORM |
| **Calendar** | FullCalendar |

## Estructura del Monorepo

```mermaid
flowchart TB
    Root["tuagenda/"]

    subgraph Apps["apps/"]
        WebApp["web-app/<br/>Next.js App"]
    end

    subgraph Packages["packages/"]
        DB["db/<br/>Prisma Schema"]
        AuthPkg["auth/<br/>Casbin Rules"]
    end

    Root --> Apps
    Root --> Packages
    WebApp --> DB
    WebApp --> AuthPkg
```

## Quick Start

```bash
# Clonar el repositorio
git clone https://github.com/tuagenda/tuagenda.git

# Instalar dependencias
pnpm install

# Iniciar base de datos
pnpm db:start
pnpm db:migrate

# Iniciar desarrollo
pnpm dev
```

## Navegación

- [**Getting Started**](/getting-started/installation) - Instalación y configuración
- [**Arquitectura**](/architecture/overview) - Diseño del sistema
- [**Base de Datos**](/database/erd) - Modelos y relaciones
- [**Flujos**](/flows/authentication) - Procesos principales
