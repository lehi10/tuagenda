# Auth Package

Paquete de autorización para TuAgenda usando Casbin con RBAC multi-dominio.

## Características

- **RBAC con dominios**: Control de acceso basado en roles con multi-tenancy (cada negocio es un dominio)
- **Soporte para SuperAdmin**: Usuarios de tipo `superadmin` tienen acceso completo a todos los recursos
- **Almacenamiento en BD**: Políticas almacenadas en PostgreSQL usando Prisma
- **Roles predefinidos**: MANAGER y EMPLOYEE con permisos específicos

## Estructura

```
src/
├── casbin/
│   ├── model.conf          # Modelo RBAC con dominios
│   └── prisma-adapter.ts   # Adaptador Prisma para Casbin
├── authorization-service.ts # Servicio principal de autorización
├── types.ts                 # Tipos y enums
├── seed-policies.ts         # Script para inicializar políticas
└── index.ts                 # Exports públicos
```

## Uso

### 1. Configurar el servicio

```typescript
import { AuthorizationService } from "auth";
import { PrismaClient } from "db";

const prisma = new PrismaClient();
const authService = AuthorizationService.getInstance(prisma);
```

### 2. Verificar permisos

```typescript
import { Resource, Action } from "auth";

const canEdit = await authService.can({
  userId: "firebase-uid-123",
  businessId: "1",
  resource: Resource.EMPLOYEE,
  action: Action.UPDATE,
});

if (canEdit) {
  // Permitir la acción
}
```

### 3. Asignar roles

```typescript
import { Role } from "auth";

// Asignar rol MANAGER al usuario en el negocio
await authService.assignRole("firebase-uid-123", Role.MANAGER, "1");

// Cambiar rol
await authService.updateRole(
  "firebase-uid-123",
  Role.EMPLOYEE,
  Role.MANAGER,
  "1"
);
```

### 4. Gestionar tipos de usuario (SuperAdmin)

```typescript
import { UserType } from "auth";

// Hacer a un usuario superadmin (acceso total)
await authService.assignUserType("firebase-uid-admin", UserType.SUPERADMIN);
```

## Modelo de Permisos

### Roles y Permisos por Defecto

**MANAGER**:
- Business: read, update
- Employee: create, read, update, delete
- Appointment: create, read, update, delete
- Settings: read, update

**EMPLOYEE**:
- Business: read
- Employee: read
- Appointment: create, read, update
- Settings: read

### Jerarquía de Usuarios

1. **superadmin**: Acceso completo a todos los negocios y recursos
2. **admin**: Sigue reglas RBAC por dominio (negocio)
3. **customer**: Sigue reglas RBAC por dominio (negocio)

## Inicialización

### Migrar la base de datos

```bash
pnpm db:migrate:dev
```

### Seed de políticas iniciales

```bash
cd packages/auth
pnpm tsx src/seed-policies.ts
```

## Recursos y Acciones

### Recursos (`Resource`)
- `BUSINESS`: Negocio/Organización
- `EMPLOYEE`: Empleados
- `APPOINTMENT`: Citas/Reservas
- `SETTINGS`: Configuración

### Acciones (`Action`)
- `CREATE`: Crear recurso
- `READ`: Leer/Ver recurso
- `UPDATE`: Actualizar recurso
- `DELETE`: Eliminar recurso
- `MANAGE`: Control total

## Ejemplos Avanzados

### Verificar múltiples permisos

```typescript
const permissions = await Promise.all([
  authService.can({
    userId,
    businessId,
    resource: Resource.EMPLOYEE,
    action: Action.CREATE,
  }),
  authService.can({
    userId,
    businessId,
    resource: Resource.SETTINGS,
    action: Action.UPDATE,
  }),
]);

const [canCreateEmployee, canUpdateSettings] = permissions;
```

### Obtener roles de un usuario

```typescript
const roles = await authService.getRolesForUserInBusiness(userId, businessId);
console.log(roles); // ['MANAGER']
```

### Agregar políticas personalizadas

```typescript
import { PolicyRule, Role, Resource, Action } from "auth";

const customPolicy: PolicyRule = {
  role: Role.EMPLOYEE,
  businessId: "*", // Aplica a todos los negocios
  resource: "custom_resource",
  action: "custom_action",
};

await authService.addPolicy(customPolicy);
```

## Integración con Use Cases

Ver ejemplos de integración en `/apps/web-app/src/core/application/use-cases/`
