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

### Opción A: Vercel Postgres (Recomendado)

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto o crea uno nuevo
3. Ve a la pestaña **Storage**
4. Haz clic en **Create Database**
5. Selecciona **Postgres**
6. Elige el nombre para tu base de datos
7. Selecciona la región (recomendado: **Washington, D.C., USA (iad1)**)
8. Haz clic en **Create**

Vercel automáticamente creará estas variables de entorno:
- `POSTGRES_URL` - URL completa de conexión
- `POSTGRES_PRISMA_URL` - URL optimizada para Prisma
- `POSTGRES_URL_NON_POOLING` - URL directa sin pooling

### Opción B: Base de datos externa (Neon, Supabase, etc.)

Si prefieres usar un proveedor externo, solo necesitas la variable `DATABASE_URL`.

## Paso 3: Configurar Variables de Entorno en Vercel

1. Ve a **Settings** → **Environment Variables**
2. Agrega las siguientes variables:

### Database
```
DATABASE_URL = <tu-postgres-url>
```
Si usas Vercel Postgres, usa la variable `POSTGRES_PRISMA_URL` que se creó automáticamente.

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

## Paso 4: Conectar el Repositorio a Vercel

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

## Paso 5: Ejecutar Migraciones de Base de Datos

**IMPORTANTE:** El cliente de Prisma se genera automáticamente durante `pnpm install` gracias al script `postinstall` en `packages/db/package.json`.

Después del primer deploy, necesitas ejecutar las migraciones de Prisma.

### Método 1: Desde tu máquina local (Recomendado)

```bash
# Asegúrate de tener la DATABASE_URL de producción
# Si usas Vercel Postgres, obtén POSTGRES_PRISMA_URL de Vercel
export DATABASE_URL="postgresql://..."

# Ejecuta las migraciones
cd packages/db
npx prisma migrate deploy
```

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

## Paso 6: Verificar el Deploy

1. Una vez que el deploy termine, Vercel te dará una URL
2. Abre la URL y verifica que la aplicación funcione
3. Revisa los logs en caso de errores: **Deployments** → selecciona tu deploy → **Build Logs** / **Function Logs**

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
