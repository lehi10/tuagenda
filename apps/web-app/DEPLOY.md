# Deploy a Vercel - Guía Completa

Esta guía te ayudará a desplegar tu aplicación TuAgenda en Vercel con PostgreSQL.

## Arquitectura del Monorepo

Este proyecto usa una arquitectura de monorepo con pnpm workspaces:

```
tuagenda/
├── apps/
│   └── web-app/          # Aplicación Next.js principal
├── packages/
│   ├── db/               # Paquete compartido de Prisma
│   │   ├── prisma/       # Schema y migraciones
│   │   ├── generated/    # Cliente generado por Prisma
│   │   └── index.ts      # Exporta el cliente singleton
│   └── auth/             # Paquete de autenticación (si aplica)
└── pnpm-workspace.yaml
```

**Ventajas:**

- ✅ El paquete `db` es compartido entre todas las apps
- ✅ Prisma Client se genera automáticamente durante `pnpm install`
- ✅ Fácil de escalar agregando nuevas apps que usen la misma DB

## Pre-requisitos

- Cuenta en Vercel (https://vercel.com)
- Proyecto en GitHub/GitLab/Bitbucket
- Cuenta de Firebase configurada

## Paso 1: Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git y sincronizado:

```bash
git add .
git commit -m "Preparar para deploy en Vercel"
git push origin main
```

## Paso 2: Configurar PostgreSQL en Vercel

**IMPORTANTE:** Vercel NO ejecuta Docker. La base de datos debe estar en un servicio gestionado externo.

### Opción A: Vercel Postgres (Recomendado - Más fácil)

Vercel Postgres es un servicio PostgreSQL totalmente gestionado basado en Neon.

**Pasos:**

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a la pestaña **Storage**
4. Haz clic en **Create Database**
5. Selecciona **Postgres**
6. Elige el nombre para tu base de datos (ej: `tuagenda-db`)
7. Selecciona la región (recomendado: **Washington, D.C., USA (iad1)**)
8. Haz clic en **Create**

**¿Qué incluye?**

- ✅ PostgreSQL totalmente gestionado
- ✅ Backup automático
- ✅ Escalado automático
- ✅ Variables de entorno automáticamente inyectadas en tu proyecto
- ✅ Plan gratuito disponible (con límites)

Vercel automáticamente creará estas variables de entorno:

- `POSTGRES_URL` - URL completa de conexión
- `POSTGRES_PRISMA_URL` - URL optimizada para Prisma (usa esta)
- `POSTGRES_URL_NON_POOLING` - URL directa sin pooling
- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_DATABASE`

**Límites del plan gratuito:**

- 256 MB de almacenamiento
- 60 horas de compute time/mes
- Ideal para desarrollo y proyectos pequeños

### Opción B: Neon (Recomendado - Más generoso)

Neon es el mismo servicio que usa Vercel Postgres internamente, pero con mejor plan gratuito.

**Pasos:**

1. Ve a [neon.tech](https://neon.tech) y crea una cuenta
2. Crea un nuevo proyecto llamado "tuagenda"
3. Selecciona la región más cercana
4. Copia la **Connection String** (formato Prisma)
5. En Vercel → Settings → Environment Variables, agrega:
   ```
   DATABASE_URL=tu-connection-string-aqui
   ```

**Límites del plan gratuito:**

- 512 MB de almacenamiento (el doble que Vercel)
- 3 GB de transferencia/mes
- 1 base de datos
- Branching de bases de datos (útil para staging)

### Opción C: Supabase (Gratis con más features)

Supabase incluye PostgreSQL + Auth + Storage + Realtime.

**Pasos:**

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Espera a que se provisione (~2 minutos)
4. Ve a Settings → Database → Connection String
5. Copia la URI en modo "Session" o "Transaction"
6. En Vercel → Settings → Environment Variables:
   ```
   DATABASE_URL=tu-connection-string-aqui
   ```

**Límites del plan gratuito:**

- 500 MB de almacenamiento
- 2 GB de transferencia/mes
- 50,000 autenticaciones/mes
- Storage gratuito

### Opción D: Railway (Fácil y generoso)

**Pasos:**

1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Agrega PostgreSQL desde el dashboard
4. Copia la **Connection URL**
5. En Vercel → Settings → Environment Variables:
   ```
   DATABASE_URL=tu-connection-string-aqui
   ```

**Límites del plan gratuito:**

- $5 USD de crédito/mes
- Suficiente para desarrollo

### ¿Cuál elegir?

| Proveedor           | Mejor para          | Storage  | Pros                              |
| ------------------- | ------------------- | -------- | --------------------------------- |
| **Vercel Postgres** | Integración simple  | 256 MB   | Auto-configurado, mismo dashboard |
| **Neon**            | Mejor plan gratuito | 512 MB   | Database branching, más storage   |
| **Supabase**        | Necesitas Auth+DB   | 500 MB   | Incluye muchos servicios extras   |
| **Railway**         | Desarrollo rápido   | Variable | Muy fácil de usar                 |

**Mi recomendación:**

- Para empezar rápido: **Vercel Postgres**
- Para producción seria: **Neon** o **Supabase**

## Paso 3: Verificar que la Base de Datos Existe

### Si usaste Vercel Postgres:

La base de datos ya está creada y lista. Las variables de entorno se inyectaron automáticamente.

### Si usaste un proveedor externo (Neon, Supabase, etc.):

1. **Verifica la conexión desde tu máquina local:**

   ```bash
   # Copia la DATABASE_URL de producción
   export DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

   # Verifica que puedes conectarte
   cd packages/db
   npx prisma db execute --stdin <<< "SELECT 1"
   ```

2. **Verifica que las tablas NO existen aún:**

   ```bash
   # Lista las tablas
   npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
   ```

   Si ves tablas, la base de datos ya tiene el schema. Si no, está vacía y lista para las migraciones.

## Paso 4: Configurar Variables de Entorno en Vercel

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

### Database

**Si usas Vercel Postgres:**

```
# La variable ya existe automáticamente
DATABASE_URL = ${POSTGRES_PRISMA_URL}
```

**Si usas un proveedor externo:**

```
DATABASE_URL = postgresql://user:password@host:5432/database?sslmode=require
```

### Firebase (obligatorio)

```
NEXT_PUBLIC_FIREBASE_API_KEY = <tu-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = <tu-proyecto>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID = <tu-proyecto-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = <tu-proyecto>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = <tu-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID = <tu-app-id>
```

**IMPORTANTE:** Asegúrate de seleccionar **All Environments** (Production, Preview, Development) para cada variable.

## Paso 5: Conectar el Repositorio a Vercel

1. En el dashboard de Vercel, haz clic en **Add New** → **Project**
2. Importa tu repositorio de Git
3. Configura el proyecto:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web-app`
   - Los comandos de build e install se tomarán automáticamente del `vercel.json`
   - **Output Directory:** `.next` (default)

4. Haz clic en **Deploy**

**Nota:** El proyecto usa un monorepo con pnpm. El `vercel.json` en `apps/web-app` ya está configurado para:

- Instalar todas las dependencias del monorepo (incluyendo el paquete `db` con Prisma)
- Generar el cliente de Prisma automáticamente durante la instalación
- Construir solo la aplicación web-app

## Paso 6: Ejecutar Migraciones de Base de Datos

**⚠️ IMPORTANTE:** Después del primer deploy, la base de datos estará **VACÍA** (sin tablas). Necesitas aplicar las migraciones.

**IMPORTANTE:** El cliente de Prisma se genera automáticamente durante `pnpm install` gracias al script `postinstall` en `packages/db/package.json`.

Después del primer deploy, necesitas ejecutar las migraciones de Prisma.

### Método 1: Desde tu máquina local (Recomendado)

**Pasos:**

1. **Obtén la DATABASE_URL de producción:**
   - Ve a Vercel → Settings → Environment Variables
   - Si usas Vercel Postgres, usa `POSTGRES_PRISMA_URL`
   - Copia el valor completo

2. **Exporta la variable y ejecuta las migraciones:**

   ```bash
   # Exporta la DATABASE_URL de producción
   export DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"

   # Ejecuta las migraciones
   cd packages/db
   npx prisma migrate deploy
   ```

3. **Verifica que se aplicaron correctamente:**

   ```bash
   # Lista las tablas creadas
   npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
   ```

   Deberías ver: `users`, `business`, `_prisma_migrations`

### Método 2: Desde Vercel CLI

```bash
# Instala Vercel CLI si no lo tienes
npm i -g vercel

# Vincula tu proyecto
vercel link

# Descarga las variables de entorno
vercel env pull .env.production

# Ejecuta las migraciones usando la DATABASE_URL de producción
cd packages/db
npx prisma migrate deploy
```

### ⚠️ Método 3: Build Hook (No recomendado)

**ADVERTENCIA:** No se recomienda ejecutar migraciones automáticamente en cada deploy porque:

- Múltiples deployments simultáneos pueden causar conflictos
- Las migraciones fallidas pueden bloquear tu deploy
- Es mejor tener control manual sobre cuándo se ejecutan las migraciones

Si aún así quieres hacerlo, puedes agregar un script de build en `packages/db/package.json`:

```json
{
  "scripts": {
    "vercel-build": "prisma migrate deploy"
  }
}
```

## Paso 7: Verificar el Deploy

### 1. Verifica que el deploy fue exitoso

- Ve a Vercel Dashboard → Deployments
- Verifica que el status sea "Ready"

### 2. Verifica que la aplicación funcione

- Abre la URL de tu deployment (ej: `https://tu-app.vercel.app`)
- La aplicación debería cargar

### 3. Verifica que la base de datos esté conectada

**Opción A: Crear una página de verificación (temporal)**

Crea `apps/web-app/src/app/api/health/route.ts`:

```typescript
import { prisma } from "db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Intenta una consulta simple
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      tables: {
        users: userCount,
        business: businessCount,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

Luego visita: `https://tu-app.vercel.app/api/health`

**Respuesta esperada:**

```json
{
  "status": "ok",
  "database": "connected",
  "tables": {
    "users": 0,
    "business": 0
  }
}
```

**Opción B: Revisar los logs**

- Ve a Vercel → Deployments → tu deploy → Function Logs
- Busca errores relacionados con la base de datos

### 4. Si hay errores de base de datos

**Error común:** `Can't reach database server`

```
Solución:
1. Verifica que DATABASE_URL esté configurada en Vercel
2. Verifica que hayas ejecutado las migraciones (Paso 6)
3. Verifica que la base de datos no esté pausada (proveedores gratuitos pausan después de inactividad)
```

**Error común:** `The table 'users' does not exist`

```
Solución:
Ejecuta las migraciones (vuelve al Paso 6)
```

## Configuración Adicional

### Dominios Personalizados

1. Ve a **Settings** → **Domains**
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones de Vercel

### Variables de Firebase para producción

Asegúrate de configurar tus dominios autorizados en Firebase Console:

1. Ve a Firebase Console → Authentication → Settings
2. En **Authorized domains**, agrega:
   - Tu dominio de Vercel (ej: `tu-proyecto.vercel.app`)
   - Tu dominio personalizado (si aplica)

## Troubleshooting

### Error: "Can't reach database server"

- Verifica que `DATABASE_URL` esté configurada correctamente
- Si usas Vercel Postgres, usa `POSTGRES_PRISMA_URL` en lugar de `POSTGRES_URL`

### Error: "Prisma Client not generated"

- El script `postinstall` está en `packages/db/package.json` y se ejecuta automáticamente
- Si el error persiste, verifica que `pnpm install` se esté ejecutando desde la raíz del monorepo
- Verifica que el paquete `db` esté listado en las dependencias de `web-app/package.json`

### Error: Build fails en Vercel

- Revisa los **Build Logs** completos
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que el **Root Directory** esté configurado como `apps/web-app`
- Verifica que los comandos en `vercel.json` apunten a la raíz del monorepo (`cd ../..`)

### Base de datos vacía

- Recuerda ejecutar `prisma migrate deploy` después del primer deploy
- Verifica que las migraciones se hayan aplicado correctamente

## Comandos Útiles

```bash
# Ver logs en tiempo real
vercel logs

# Ejecutar comando en el entorno de Vercel
vercel exec -- <comando>

# Descargar variables de entorno
vercel env pull

# Listar deployments
vercel ls

# Promover un deployment a producción
vercel promote <deployment-url>

# Ejecutar build localmente (desde la raíz del monorepo)
pnpm --filter web-app build

# Generar Prisma Client manualmente
cd packages/db && npx prisma generate
```

## Next Steps

- Configura CI/CD con GitHub Actions (opcional)
- Configura alertas y monitoring
- Configura backups automáticos de la base de datos
- Revisa y ajusta los límites de tu plan de Vercel según tu tráfico

## Recursos

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
