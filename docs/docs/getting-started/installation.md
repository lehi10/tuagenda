---
sidebar_position: 1
---

# Instalación

## Requisitos Previos

- **Node.js** >= 20.0
- **pnpm** >= 10.12.1
- **Docker** (para PostgreSQL local)
- **Git**

## Clonar el Repositorio

```bash
git clone https://github.com/tuagenda/tuagenda.git
cd tuagenda
```

## Instalar Dependencias

```bash
pnpm install
```

## Configurar Variables de Entorno

Copia el archivo de ejemplo y configura las variables:

```bash
cp apps/web-app/.env.example apps/web-app/.env.local
```

### Variables Requeridas

```env
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tuagenda"

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

## Iniciar Base de Datos

```bash
# Iniciar PostgreSQL con Docker
pnpm db:start

# Ejecutar migraciones
pnpm db:migrate

# (Opcional) Abrir Prisma Studio
pnpm db:studio
```

## Verificar Instalación

```bash
# Ejecutar tests
pnpm test

# Verificar tipos
pnpm typecheck

# Verificar linting
pnpm lint
```

## Flujo de Instalación

```mermaid
flowchart TD
    A[Clonar Repo] --> B[pnpm install]
    B --> C[Configurar .env]
    C --> D[pnpm db:start]
    D --> E[pnpm db:migrate]
    E --> F{Tests pasan?}
    F -->|Sí| G[pnpm dev]
    F -->|No| H[Revisar logs]
    H --> C
```
