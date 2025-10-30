# Base de Datos - Guía Completa

Esta guía explica cómo configurar y trabajar con la base de datos PostgreSQL en TuAgenda.

## Arquitectura

- **Base de datos:** PostgreSQL 15
- **ORM:** Prisma
- **Desarrollo local:** Docker Compose
- **Producción:** Vercel Postgres (u otro proveedor)

## Setup Inicial - Desarrollo Local

### 1. Iniciar la base de datos con Docker

```bash
# Iniciar PostgreSQL en Docker (en segundo plano)
pnpm db:start

# Verificar que está corriendo
docker ps
```

Esto creará un contenedor con:
- **Host:** localhost
- **Puerto:** 5432
- **Usuario:** postgres
- **Password:** postgres
- **Base de datos:** tuagenda_db

### 2. Aplicar las migraciones

```bash
# Aplicar todas las migraciones pendientes
pnpm db:migrate
```

### 3. Verificar que todo funciona

```bash
# Abrir Prisma Studio (interfaz visual para ver/editar datos)
pnpm db:studio
```

Prisma Studio se abrirá en http://localhost:5555

## Comandos Disponibles

### Gestión del contenedor Docker

```bash
# Iniciar PostgreSQL
pnpm db:start

# Detener PostgreSQL
pnpm db:stop

# Reiniciar y limpiar toda la base de datos (¡cuidado! borra todos los datos)
pnpm db:reset
```

### Migraciones

```bash
# Aplicar migraciones (producción/staging)
pnpm db:migrate

# Crear y aplicar nueva migración (desarrollo)
pnpm db:migrate:dev

# Push schema sin crear migración (útil para prototipos)
pnpm db:push
```

### Utilidades

```bash
# Abrir Prisma Studio (interfaz visual)
pnpm db:studio

# Generar Prisma Client manualmente
pnpm db:generate

# Ejecutar seed (poblar datos de prueba)
pnpm db:seed
```

## Workflow de Desarrollo

### Cambiar el schema de la base de datos

1. Edita el archivo `packages/db/prisma/schema.prisma`

```prisma
model NuevoModelo {
  id        Int      @id @default(autoincrement())
  nombre    String
  createdAt DateTime @default(now())
}
```

2. Crea y aplica la migración:

```bash
pnpm db:migrate:dev --name add_nuevo_modelo
```

3. El cliente de Prisma se regenera automáticamente.

### Usar Prisma Client en tu código

```typescript
import { prisma } from "db";

// Crear un usuario
const user = await prisma.user.create({
  data: {
    id: "firebase-uid-123",
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan@example.com",
  },
});

// Buscar usuarios
const users = await prisma.user.findMany({
  where: {
    status: "visible",
  },
});

// Actualizar
await prisma.user.update({
  where: { id: "firebase-uid-123" },
  data: { firstName: "Juan Carlos" },
});

// Eliminar
await prisma.user.delete({
  where: { id: "firebase-uid-123" },
});
```

## Variables de Entorno

### Desarrollo Local

En `packages/db/.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tuagenda_db"
```

### Producción (Vercel)

En Vercel Dashboard → Settings → Environment Variables:

```bash
# Si usas Vercel Postgres
DATABASE_URL="${POSTGRES_PRISMA_URL}"

# O directamente
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

## Troubleshooting

### Error: "Can't reach database server at localhost:5432"

**Solución:**
```bash
# Verifica que Docker esté corriendo
docker ps

# Si no está corriendo, inícialo
pnpm db:start

# Verifica los logs del contenedor
docker logs tuagenda_container
```

### Error: "Prisma Client not generated"

**Solución:**
```bash
# Regenera el cliente
pnpm db:generate
```

### Error: "Migration failed"

**Solución:**
```bash
# Verifica el estado de las migraciones
cd packages/db && npx prisma migrate status

# Si es desarrollo local y no importa perder datos
pnpm db:reset
```

### Quiero empezar desde cero

**Desarrollo Local:**
```bash
# Borra la base de datos y vuelve a crear todo
pnpm db:reset
```

**Producción (¡CUIDADO!):**
```bash
# NO uses db:reset en producción
# En su lugar, crea migraciones para revertir cambios
pnpm db:migrate:dev --name revert_cambios
```

## Modelos Actuales

### User
- ID: Firebase UID
- Información personal: nombre, email, teléfono
- Status: hidden, visible, disabled, blocked
- Type: customer, provider, manager, admin

### Business
- Información del negocio: título, descripción, logo
- Ubicación: dirección, ciudad, país, coordenadas
- Configuración: timezone, locale, currency
- Status: active, inactive, suspended

## Mejores Prácticas

1. **Siempre usa migraciones** - No edites la base de datos directamente
2. **Nombra las migraciones descriptivamente** - `add_user_preferences`, no `migration1`
3. **Usa transacciones** para operaciones múltiples:
   ```typescript
   await prisma.$transaction([
     prisma.user.create({ data: userData }),
     prisma.business.create({ data: businessData }),
   ]);
   ```
4. **Maneja errores** específicos de Prisma:
   ```typescript
   import { Prisma } from "db";

   try {
     await prisma.user.create({ data });
   } catch (error) {
     if (error instanceof Prisma.PrismaClientKnownRequestError) {
       if (error.code === "P2002") {
         console.error("Email already exists");
       }
     }
   }
   ```

## Verificar que la Base de Datos Existe

### Método 1: Usando Prisma Studio
```bash
pnpm db:studio
```
Si se abre la interfaz, la base de datos está funcionando.

### Método 2: Desde el código
```typescript
// En cualquier parte de tu app
import { prisma } from "db";

// Intenta hacer una consulta simple
const count = await prisma.user.count();
console.log(`Database connected. Users: ${count}`);
```

### Método 3: Docker CLI
```bash
# Conectarse al contenedor
docker exec -it tuagenda_container psql -U postgres -d tuagenda_db

# Listar tablas
\dt

# Salir
\q
```

### Método 4: Script de verificación

Agrega en `package.json`:
```json
{
  "scripts": {
    "db:check": "cd packages/db && npx prisma db execute --stdin <<< 'SELECT 1'"
  }
}
```

Luego ejecuta:
```bash
pnpm db:check
```

## Recursos

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
