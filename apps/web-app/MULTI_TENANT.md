# Sistema Multi-Tenant (Multi-Empresa)

Este documento describe la arquitectura multi-tenant implementada en TuAgenda.

## 🏢 Concepto

TuAgenda es un sistema SaaS que permite a múltiples empresas usar la misma plataforma. Cada empresa (tenant/organización) tiene sus propios datos completamente aislados.

---

## 🎯 Componentes Implementados

### 1. **OrganizationContext** (`src/contexts/organization-context.tsx`)

Context global que mantiene:

- `currentOrg`: Organización actualmente seleccionada
- `organizations`: Lista de todas las organizaciones
- `setCurrentOrg`: Función para cambiar de organización
- `isSuperAdmin`: Flag que indica si el usuario es super admin

```tsx
import { useOrganization } from "@/contexts/organization-context";

function MyComponent() {
  const { currentOrg, setCurrentOrg, isSuperAdmin } = useOrganization();

  return <div>{currentOrg?.name}</div>;
}
```

### 2. **OrganizationSwitcher** (`src/components/organization-switcher.tsx`)

Componente selector de empresas con:

- Lista completa de organizaciones
- Búsqueda por nombre
- Información de cada organización (empleados, ubicaciones, plan)
- Badges de plan (Free, Pro, Enterprise)
- Solo visible para super admins

**Ubicación:** Header del sidebar

### 3. **OrganizationBanner** (`src/components/organization-banner.tsx`)

Banner informativo que muestra:

- Nombre de la organización actual
- Plan contratado
- Número de empleados y ubicaciones
- Badge de "Super Admin View" si aplica

**Ubicación:** Dashboard principal

---

## 🔐 Tipos de Usuarios

### Super Admin

- **Acceso:** Todas las organizaciones
- **Permisos:** Crear, editar, eliminar organizaciones
- **Vista:** Puede cambiar entre empresas con el selector
- **Caso de uso:** Tu equipo de soporte/administración

### Admin de Empresa

- **Acceso:** Solo su organización
- **Permisos:** Gestión completa de su empresa
- **Vista:** No ve el selector, solo su empresa
- **Caso de uso:** Dueño del salón/spa/clínica

### Empleado

- **Acceso:** Solo su organización (vista limitada)
- **Permisos:** Ver su agenda, clientes asignados
- **Vista:** Dashboard simplificado
- **Caso de uso:** Estilistas, masajistas, etc.

---

## 🗄️ Estructura de Base de Datos (Recomendada)

### Opción 1: Columna `organization_id` (Más simple)

Cada tabla tiene una columna `organization_id`:

```sql
-- Tabla de organizaciones
CREATE TABLE organizations (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Todas las tablas tienen organization_id
CREATE TABLE employees (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  -- ... más campos
);

CREATE TABLE clients (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255),
  email VARCHAR(255),
  -- ... más campos
);

CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  employee_id UUID REFERENCES employees(id),
  -- ... más campos
);
```

**Ventajas:**

- Simple de implementar
- Fácil de entender
- Queries directos

**Desventajas:**

- Posibilidad de fugas de datos si olvidas el WHERE
- No óptimo para escala masiva

### Opción 2: Schemas separados (Más seguro)

Cada organización tiene su propio schema de PostgreSQL:

```sql
-- Schema por organización
CREATE SCHEMA org_acme_inc;
CREATE SCHEMA org_beauty_salon;

-- Tablas dentro de cada schema
CREATE TABLE org_acme_inc.employees (...);
CREATE TABLE org_acme_inc.clients (...);

CREATE TABLE org_beauty_salon.employees (...);
CREATE TABLE org_beauty_salon.clients (...);
```

**Ventajas:**

- Aislamiento completo de datos
- Imposible mezclar datos entre empresas
- Mejor para cumplimiento (GDPR, HIPAA)

**Desventajas:**

- Más complejo de administrar
- Queries cross-tenant complicadas

### Opción 3: Bases de datos separadas (Máxima separación)

Cada organización tiene su propia database.

**Solo usar si:**

- Clientes muy grandes (enterprise)
- Requisitos regulatorios estrictos
- SLA diferenciado por cliente

---

## 🔒 Row Level Security (RLS) - Recomendado

Si usas Supabase o PostgreSQL, implementa RLS:

```sql
-- Habilitar RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Policy: Los usuarios solo ven datos de su organización
CREATE POLICY "Users see own organization data" ON employees
  FOR SELECT
  USING (organization_id = current_setting('app.current_organization_id')::uuid);

CREATE POLICY "Users see own organization data" ON clients
  FOR SELECT
  USING (organization_id = current_setting('app.current_organization_id')::uuid);
```

---

## 🔌 Implementación Backend

### 1. Middleware de Organización

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const orgId = request.cookies.get("current_org_id")?.value;

  if (!orgId && !isPublicRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/select-org", request.url));
  }

  // Añadir org_id a los headers para todas las requests
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-organization-id", orgId);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

### 2. API Routes con Filtrado

```typescript
// app/api/employees/route.ts
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const orgId = request.headers.get("x-organization-id");

  if (!orgId) {
    return Response.json(
      { error: "No organization selected" },
      { status: 400 }
    );
  }

  // SIEMPRE filtrar por organization_id
  const employees = await db.employees.findMany({
    where: {
      organization_id: orgId,
    },
  });

  return Response.json(employees);
}
```

### 3. Prisma con Organization Scope

```typescript
// lib/db.ts
import { PrismaClient } from "@prisma/client";

export function createPrismaClient(organizationId: string) {
  const prisma = new PrismaClient();

  // Middleware para auto-filtrar por org
  prisma.$use(async (params, next) => {
    if (params.model) {
      if (params.action === "findMany" || params.action === "findFirst") {
        params.args = {
          ...params.args,
          where: {
            ...params.args?.where,
            organization_id: organizationId,
          },
        };
      }

      if (params.action === "create") {
        params.args = {
          ...params.args,
          data: {
            ...params.args?.data,
            organization_id: organizationId,
          },
        };
      }
    }

    return next(params);
  });

  return prisma;
}
```

---

## 🎨 Frontend: Usando el Contexto

### En cualquier componente:

```tsx
"use client";

import { useOrganization } from "@/contexts/organization-context";

export function MyComponent() {
  const { currentOrg, organizations, setCurrentOrg } = useOrganization();

  // Mostrar datos de la organización actual
  return (
    <div>
      <h1>{currentOrg?.name}</h1>
      <p>Plan: {currentOrg?.plan}</p>
    </div>
  );
}
```

### Cambiar de organización:

```tsx
const { organizations, setCurrentOrg } = useOrganization();

// Cambiar a otra organización
const handleSwitch = (orgId: string) => {
  const org = organizations.find((o) => o.id === orgId);
  if (org) {
    setCurrentOrg(org);
  }
};
```

---

## 🔐 Control de Acceso

### Ejemplo de verificación de permisos:

```tsx
"use client";

import { useOrganization } from "@/contexts/organization-context";

export function DeleteButton() {
  const { isSuperAdmin } = useOrganization();

  if (!isSuperAdmin) {
    return null; // Solo super admins pueden eliminar
  }

  return <button>Delete Organization</button>;
}
```

---

## 📝 Checklist de Seguridad

- [ ] **Nunca** hacer queries sin filtrar por `organization_id`
- [ ] Validar `organization_id` en TODAS las API routes
- [ ] Implementar RLS en la base de datos
- [ ] Auditar logs de cambios de organización
- [ ] No permitir que usuarios vean orgs a las que no pertenecen
- [ ] Sanitizar slugs de organizaciones
- [ ] Rate limiting por organización
- [ ] Backups separados por organización (opcional)

---

## 🚀 Testing

### Test de aislamiento de datos:

```typescript
describe("Organization Isolation", () => {
  it("should not return data from other organizations", async () => {
    const user = await loginAs("org1_admin");
    const employees = await getEmployees(user);

    // Verificar que NO haya empleados de org2
    expect(employees.every((e) => e.organization_id === "org1")).toBe(true);
  });

  it("super admin can switch organizations", async () => {
    const superAdmin = await loginAsSuperAdmin();

    await switchOrganization("org1");
    const org1Data = await getEmployees(superAdmin);

    await switchOrganization("org2");
    const org2Data = await getEmployees(superAdmin);

    expect(org1Data).not.toEqual(org2Data);
  });
});
```

---

## 🎯 Próximos Pasos

1. **Persistir organización seleccionada:**
   - En localStorage
   - En cookie
   - En sesión del servidor

2. **Implementar Base de Datos:**
   - Schema con `organization_id`
   - RLS policies
   - Migrations

3. **Auth con Organizaciones:**
   - Vincular usuarios a organizaciones
   - Permisos por rol
   - Invitaciones a empleados

4. **Subdominios (opcional):**

   ```
   acme-inc.tuagenda.com
   beauty-salon.tuagenda.com
   ```

5. **Billing por Organización:**
   - Planes (Free, Pro, Enterprise)
   - Límites por plan
   - Stripe con `organization_id` como customer

---

## 💡 Mejores Prácticas

1. **Siempre usa el contexto:** No hardcodees `organization_id`
2. **Valida en backend:** Nunca confíes solo en el frontend
3. **Logs de auditoría:** Registra cambios de organización
4. **Testing exhaustivo:** Prueba aislamiento de datos
5. **Monitoring:** Alertas si datos se mezclan
6. **Documentación:** Mantén este doc actualizado

---

## 📚 Referencias

- [Multi-tenancy patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/multi-tenancy)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Prisma Multi-tenant](https://www.prisma.io/docs/guides/database/multi-tenant)
