---
sidebar_position: 1
---

# Vista General

## Arquitectura del Sistema

TuAgenda sigue una arquitectura **Hexagonal (Ports & Adapters)** combinada con el patrón **Monorepo**.

```mermaid
flowchart TB
    subgraph External["Mundo Exterior"]
        Browser["Browser"]
        Firebase["Firebase Auth"]
        PostgreSQL[(PostgreSQL)]
    end

    subgraph Apps["apps/"]
        subgraph WebApp["web-app (Next.js 15)"]
            subgraph Presentation["Capa de Presentación"]
                Pages["Pages/Routes"]
                Components["Components"]
                Hooks["Hooks"]
            end

            subgraph Server["Capa de Servidor"]
                Actions["Server Actions"]
                TRPC["tRPC Routers"]
            end

            subgraph Core["Núcleo de Negocio"]
                UseCases["Use Cases"]
                Entities["Entities"]
                Ports["Ports (Interfaces)"]
            end

            subgraph Infra["Infraestructura"]
                Repos["Repositories"]
                Mappers["Mappers"]
            end
        end
    end

    subgraph Packages["packages/"]
        DB["db (Prisma)"]
        Auth["auth (Casbin)"]
    end

    Browser --> Pages
    Pages --> Components
    Components --> Hooks
    Hooks --> Actions
    Hooks --> TRPC

    Actions --> UseCases
    TRPC --> UseCases

    UseCases --> Ports
    Ports -.-> Repos
    Repos --> Mappers
    Mappers --> DB

    DB --> PostgreSQL
    Actions --> Auth
    TRPC --> Auth
    Auth --> Firebase
```

## Capas del Sistema

### 1. Presentación (Client)

```mermaid
flowchart LR
    subgraph Client["src/client/"]
        Pages["pages/"]
        Components["components/"]
        Features["features/"]
        Hooks["hooks/"]
        Contexts["contexts/"]
    end

    Pages --> Features
    Features --> Components
    Features --> Hooks
    Hooks --> Contexts
```

| Carpeta | Responsabilidad |
|---------|-----------------|
| `components/ui/` | Componentes primitivos (Radix UI) |
| `features/` | Módulos por dominio |
| `hooks/` | Custom React Hooks |
| `contexts/` | Estado global (Auth, Business) |

### 2. Servidor (Server)

```mermaid
flowchart LR
    subgraph Server["src/server/"]
        API["api/ (Actions)"]
        TRPC["trpc/ (Routers)"]
        Core["core/ (Negocio)"]
        Infra["infrastructure/"]
    end

    API --> Core
    TRPC --> Core
    Core --> Infra
```

| Carpeta | Responsabilidad |
|---------|-----------------|
| `api/` | Server Actions de Next.js |
| `trpc/` | Routers y procedures tRPC |
| `core/` | Lógica de negocio |
| `infrastructure/` | Adaptadores externos |

### 3. Shared

```mermaid
flowchart LR
    subgraph Shared["src/shared/"]
        Types["types/"]
        Validations["validations/"]
        Utils["utils/"]
        Constants["constants/"]
    end
```

Código compartido entre cliente y servidor.

## Flujo de Datos

```mermaid
sequenceDiagram
    participant B as Browser
    participant P as Page/Component
    participant H as Hook
    participant A as Server Action
    participant U as Use Case
    participant R as Repository
    participant D as Database

    B->>P: Interacción usuario
    P->>H: Llamar hook
    H->>A: Invocar action
    A->>U: Ejecutar caso de uso
    U->>R: Acceder datos
    R->>D: Query/Mutation
    D-->>R: Resultado
    R-->>U: Entity
    U-->>A: Domain Object
    A-->>H: DTO
    H-->>P: Estado actualizado
    P-->>B: UI actualizada
```

## Principios de Diseño

### Inversión de Dependencias

```mermaid
flowchart TB
    subgraph High["Alto Nivel (Negocio)"]
        UC["Use Case"]
        Port["Port (Interface)"]
    end

    subgraph Low["Bajo Nivel (Infraestructura)"]
        Repo["Repository (Prisma)"]
    end

    UC --> Port
    Repo -.->|implementa| Port

    style Port fill:#f9f,stroke:#333
```

- Los **Use Cases** dependen de **Ports** (interfaces)
- Los **Repositories** implementan los **Ports**
- El negocio no conoce la infraestructura

### Separación de Concerns

| Capa | Conoce | No conoce |
|------|--------|-----------|
| UI | Hooks, Components | Use Cases, DB |
| Hooks | Actions, tRPC | Repositories |
| Use Cases | Ports | Prisma, PostgreSQL |
| Repositories | Prisma | UI, Hooks |
