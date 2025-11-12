# TuAgenda - Contexto del Proyecto

## Descripción General

**TuAgenda** es una aplicación web SaaS para gestión de citas y negocios, construida con tecnologías modernas. Permite a los negocios gestionar sus citas, clientes, empleados, servicios y ubicaciones en una plataforma centralizada.

**Tipo de proyecto:** Monorepo con pnpm workspaces
**Versión de Node:** >= 20.0.0
**Package Manager:** pnpm@10.12.1
**Puerto de desarrollo:** 3001

---

## Tecnologías Principales

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **React:** 19.1.0
- **Lenguaje:** TypeScript 5.x
- **Estilos:** Tailwind CSS v4 + PostCSS
- **UI Components:** Radix UI (headless components)
- **Iconos:** Lucide React
- **Utilidades CSS:**
  - `clsx` - Class name utilities
  - `tailwind-merge` - Merge Tailwind classes
  - `class-variance-authority` - Component variants
- **Calendario:** FullCalendar 6.1.19
  - Core + DayGrid + TimeGrid + List + Interaction plugins
- **Animaciones:** tw-animate-css

### Backend & Base de Datos
- **Base de Datos:** PostgreSQL 15 (Docker en desarrollo)
- **ORM:** Prisma 6.18.0
- **Autenticación:** Firebase 12.4.0
  - Email/Password authentication
  - Google OAuth
  - Gestión de usuarios
- **Arquitectura de datos:**
  - Server Actions para operaciones de base de datos
  - Servicios del lado del cliente solo para Firebase Auth

### State Management & Data Fetching
- **React Query:** @tanstack/react-query 5.90.5 (cache y sincronización de datos del servidor)
- **Context API:** Para autenticación y organización
- **Forms:** React Hook Form 7.65.0 + Zod 4.1.12 para validación

### Utilities
- **Validación:** Zod 4.1.12
- **Fechas:** date-fns 4.1.0 + react-day-picker 9.11.1
- **Notificaciones:** Sonner 2.0.7 (toast notifications)
- **Command Palette:** cmdk 1.1.1

### Testing
- **Framework:** Jest 30.2.0
- **Testing Library:** React Testing Library 16.3.0
- **Entorno:** jsdom

### Tooling
- **Linter:** ESLint 9 + TypeScript ESLint 8.45.0
- **Formatter:** Prettier 3.6.2
- **Build:** Next.js con Turbopack

---

## Estructura del Proyecto

```
tuagenda/
├── apps/
│   └── web-app/                 # Aplicación principal Next.js
│       ├── src/
│       │   ├── actions/         # Server Actions (operaciones de base de datos)
│       │   │   └── user/
│       │   ├── app/             # Next.js App Router
│       │   │   ├── (marketing)/ # Páginas públicas de marketing
│       │   │   ├── (public)/    # Páginas de autenticación
│       │   │   └── (private)/   # Páginas protegidas
│       │   ├── components/      # Componentes compartidos de UI
│       │   ├── contexts/        # Context providers (Auth, Organization)
│       │   ├── features/        # Features organizados por dominio
│       │   ├── hooks/           # Custom React hooks
│       │   ├── lib/             # Utilidades y configuraciones
│       │   │   ├── auth/        # Servicios de autenticación
│       │   │   └── db/          # Configuración de Prisma
│       │   └── i18n/            # Internacionalización
│       └── package.json
├── packages/
│   └── db/                      # Package de base de datos
│       ├── prisma/
│       │   └── schema.prisma    # Schema de Prisma
│       └── migrations/          # Migraciones de base de datos
├── docker-compose.yml           # PostgreSQL para desarrollo
└── package.json                 # Root package.json
```

---

## Arquitectura de Base de Datos

### Modelos Principales

#### User
```prisma
model User {
  id              String      # Firebase UID (PK)
  status          UserStatus  # visible, hidden, disabled, blocked
  type            UserType    # customer, admin, superadmin
  firstName       String
  lastName        String
  email           String      # Unique
  birthday        DateTime?
  phone           String?
  countryCode     String?
  note            String?
  description     String?
  pictureFullPath String?
  timeZone        String?
  createdAt       DateTime
  updatedAt       DateTime

  businessUsers   BusinessUser[]  # Relación N:N con Business
}
```

#### Business
```prisma
model Business {
  id          Int             # Auto-increment PK
  title       String
  slug        String          # Unique
  domain      String?
  description String?
  logo        String?
  coverImage  String?
  timeZone    String
  locale      String
  currency    String
  status      BusinessStatus  # active, inactive, suspended
  email       String
  phone       String
  website     String?
  address     String
  city        String
  state       String?
  country     String
  postalCode  String?
  latitude    Float?
  longitude   Float?
  createdAt   DateTime
  updatedAt   DateTime

  businessUsers BusinessUser[]  # Relación N:N con User
}
```

#### BusinessUser (Tabla intermedia)
```prisma
model BusinessUser {
  id         Int           # Auto-increment PK
  userId     String
  businessId Int
  role       BusinessRole  # MANAGER, EMPLOYEE
  createdAt  DateTime
  updatedAt  DateTime

  user       User
  business   Business

  @@unique([userId, businessId])  # Un usuario solo puede tener un rol por negocio
}
```

### Enums
- **UserStatus:** hidden, visible, disabled, blocked
- **UserType:** customer, admin, superadmin
- **BusinessStatus:** active, inactive, suspended
- **BusinessRole:** MANAGER, EMPLOYEE

---

## Páginas Principales

### Públicas (Marketing)
- `/` - Landing page
- `/about-us` - Acerca de nosotros
- `/pricing` - Planes y precios
- `/privacy-policy` - Política de privacidad
- `/terms-of-service` - Términos de servicio

### Públicas (Autenticación)
- `/login` - Inicio de sesión
- `/signup` - Registro
- `/forgot-password` - Recuperación de contraseña

### Privadas (Aplicación)
- `/dashboard` - Panel principal
- `/profile` - Perfil de usuario
- `/business` - Gestión de negocios
- `/calendar` - Calendario de citas
- `/appointments` - Gestión de citas
- `/clients` - Gestión de clientes
- `/employees` - Gestión de empleados
- `/services` - Gestión de servicios
- `/locations` - Gestión de ubicaciones
- `/payments` - Gestión de pagos
- `/notifications` - Centro de notificaciones
- `/settings` - Configuración

---

## Features del Proyecto

Cada feature está organizado en su propio directorio con componentes, hooks y lógica relacionada:

1. **Appointments** - Gestión de citas
2. **Business** - Gestión de negocios
3. **Calendar** - Vista de calendario
4. **Clients** - Gestión de clientes
5. **Dashboard** - Panel de control
6. **Employees** - Gestión de empleados
7. **Locations** - Gestión de ubicaciones
8. **Notifications** - Sistema de notificaciones
9. **Payments** - Gestión de pagos
10. **Profile** - Perfil de usuario
11. **Services** - Gestión de servicios
12. **Settings** - Configuración de la aplicación

---

## Arquitectura de Datos

### Patrón de Arquitectura

El proyecto sigue una arquitectura clara y consistente:

#### Server Actions (Backend)
Ubicados en `src/actions/`, se utilizan para:
- ✅ Operaciones con la base de datos (PostgreSQL vía Prisma)
- ✅ Lógica de negocio sensible
- ✅ Validaciones del lado del servidor (Zod)
- ✅ Operaciones que requieren secretos del servidor

**Ejemplo:**
```typescript
// src/actions/user/get-user.action.ts
"use server";
import { prisma } from "@/lib/db/prisma";

export async function getUserByIdAction(firebaseUid: string) {
  const user = await prisma.user.findUnique({
    where: { id: firebaseUid }
  });
  return { success: true, user };
}
```

#### Client Services (Frontend)
Ubicados en `src/lib/`, se utilizan para:
- ✅ Integraciones con SDKs del lado del cliente (Firebase Auth)
- ✅ Lógica de UI/estado del cliente
- ✅ APIs de terceros que requieren ejecutarse en el navegador

**Ejemplo:**
```typescript
// src/lib/auth/auth-service.ts
export function getAuthService(): IAuthService {
  return new FirebaseAuthService();
}
```

### Flujo de Autenticación

1. **Usuario se autentica** → Firebase Auth (cliente)
2. **Obtener Firebase UID** → Token de autenticación
3. **Sincronizar con DB** → Server Action crea/obtiene usuario en PostgreSQL
4. **Cargar datos** → AuthContext gestiona el estado global del usuario
5. **Navegar a app** → Usuario autenticado con datos de DB

```typescript
// Flujo completo en AuthContext
onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    // Cargar datos del usuario desde PostgreSQL
    const result = await getUserByIdAction(firebaseUser.uid);
    setState({ user: result.user, loading: false });
  }
});
```

---

## Context Providers

### AuthContext
Gestiona el estado de autenticación global:
- Estado del usuario actual (datos de PostgreSQL)
- Loading states
- Métodos de autenticación (signIn, signUp, signOut, etc.)
- Sincronización con Firebase Auth
- Retry logic para manejo de race conditions

### OrganizationContext
Gestiona el contexto de la organización/negocio actual.

---

## Validación de Datos

Todo el proyecto usa **Zod** para validación de esquemas:

```typescript
// src/lib/validations/user.schema.ts
import { z } from "zod";

export const createUserFromAuthSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string().min(1).max(255),
  lastName: z.string().min(1).max(255),
  pictureFullPath: z.string().url().optional(),
});
```

---

## Gestión de Estado

### React Query
Usado para cache y sincronización de datos del servidor:
- Invalidación automática de queries
- Optimistic updates
- Background refetching
- Cache management

### Context API
Usado para estado global de la aplicación:
- `AuthContext` - Autenticación
- `OrganizationContext` - Organización actual

---

## Comandos Disponibles

### Desarrollo
```bash
pnpm dev           # Iniciar desarrollo (puerto 3001)
pnpm dev:all       # Iniciar todos los workspaces en paralelo
pnpm build         # Build de producción
pnpm start         # Iniciar servidor de producción
```

### Base de Datos
```bash
pnpm db:start      # Iniciar PostgreSQL (Docker)
pnpm db:stop       # Detener PostgreSQL
pnpm db:reset      # Reiniciar y limpiar DB
pnpm db:migrate    # Aplicar migraciones
pnpm db:studio     # Abrir Prisma Studio (localhost:5555)
pnpm db:push       # Push schema sin migración
pnpm db:seed       # Poblar datos de prueba
```

### Calidad de Código
```bash
pnpm lint          # Ejecutar ESLint
pnpm lint:fix      # Ejecutar ESLint y auto-fix
pnpm format        # Ejecutar Prettier
pnpm test          # Ejecutar tests con Jest
pnpm test:watch    # Ejecutar tests en modo watch
pnpm test:coverage # Ejecutar tests con cobertura
```

---

## Variables de Entorno

### Firebase (Cliente)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

### Base de Datos (Servidor)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tuagenda_db"
```

### Desarrollo con Docker
La configuración de Docker está en `docker-compose.yml`:
- **Host:** localhost
- **Puerto:** 5432
- **Usuario:** postgres
- **Password:** postgres
- **Database:** tuagenda_db

---

## Logging

El proyecto usa un logger personalizado:
```typescript
import { logger } from "@/lib/logger";

logger.info("FEATURE_NAME", userId, "Message");
logger.error("FEATURE_NAME", userId, "Error message");
logger.fatal("FEATURE_NAME", userId, "Critical error");
```

---

## Convenciones de Código

### Nomenclatura
- **Components:** PascalCase (`UserProfile.tsx`)
- **Server Actions:** kebab-case con `.action.ts` (`get-user.action.ts`)
- **Hooks:** camelCase con `use` prefix (`useAuth.ts`)
- **Utils:** kebab-case (`format-date.ts`)
- **Types:** PascalCase con `.types.ts` (`auth.types.ts`)

### Estructura de Componentes
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Exports
```

### Server Actions
Todos los server actions deben:
- Incluir `"use server"` al inicio
- Tener tipos de retorno explícitos
- Manejar errores apropiadamente
- Validar datos con Zod
- Retornar objetos con `{ success: boolean, ... }`

---

## Despliegue

### Vercel (Recomendado)
El proyecto está optimizado para Vercel:
- Build automático desde Git
- Edge Network global
- Variables de entorno por ambiente
- Integración con Vercel Postgres (opcional)

Ver `vercel.json` para configuración.

---

## Características Clave del Stack

### Next.js 15 App Router
- Server Components por defecto
- Streaming y Suspense
- Server Actions nativos
- Optimización automática de imágenes
- Route handlers para APIs

### Turbopack
Bundler ultra-rápido para desarrollo (--turbopack flag).

### Prisma ORM
- Type-safe database queries
- Auto-generated types
- Migrations system
- Prisma Studio para inspección visual

### Firebase Auth
- Múltiples métodos de autenticación
- Session management
- Security rules
- SDK optimizado para web

---

## Mejores Prácticas del Proyecto

1. **Usa Server Actions** para toda operación de base de datos
2. **Valida con Zod** tanto en cliente como servidor
3. **Componentes pequeños** y especializados
4. **React Query** para data fetching del servidor
5. **Manejo de errores** consistente con try/catch
6. **Logging** en puntos clave de la aplicación
7. **TypeScript estricto** en todo el código
8. **No uses `any`** - usa tipos específicos o `unknown`
9. **Commits descriptivos** siguiendo conventional commits
10. **Migraciones** para todos los cambios de schema

---

## Roadmap & Estado Actual

### Completado ✅
- Sistema de autenticación (Firebase + PostgreSQL)
- CRUD de usuarios
- CRUD de negocios
- Relación N:N entre usuarios y negocios
- Layout de la aplicación
- Navegación y routing
- Sistema de contextos (Auth, Organization)

### En Desarrollo 🚧
- Gestión completa de citas
- Sistema de calendario interactivo
- Gestión de servicios
- Gestión de empleados
- Sistema de pagos
- Notificaciones

### Planificado 📋
- Internacionalización completa
- Sistema de permisos granular
- Dashboard con analytics
- Exportación de datos
- API pública
- Mobile app (React Native)

---

## Recursos y Documentación

- **Next.js 15:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Firebase:** https://firebase.google.com/docs
- **TanStack Query:** https://tanstack.com/query/latest
- **Radix UI:** https://www.radix-ui.com/
- **Zod:** https://zod.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## Notas para Otras IAs

### Cuando trabajes en este proyecto:
1. Siempre usa **Server Actions** para operaciones de base de datos
2. Los IDs de usuario son **Firebase UIDs** (string), no auto-increment
3. La autenticación es híbrida: **Firebase Auth + PostgreSQL**
4. Valida datos con **Zod** antes de enviar a la base de datos
5. Usa **React Query** para cache de datos del servidor
6. Sigue la estructura de carpetas establecida
7. Mantén componentes desacoplados y reutilizables
8. El logger requiere: `(feature: string, userId: string, message: string)`

### Patrones comunes:
```typescript
// ✅ Correcto: Server Action
"use server";
export async function createUser(data: UserData) {
  const validated = userSchema.parse(data);
  const user = await prisma.user.create({ data: validated });
  return { success: true, user };
}

// ✅ Correcto: Client Component con React Query
"use client";
export function UserList() {
  const { data, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => getUsersAction()
  });
}

// ❌ Incorrecto: No usar Prisma directamente en componentes
export function UserList() {
  const users = await prisma.user.findMany(); // ❌ NO HACER ESTO
}
```

---

**Última actualización:** 2025-11-01
**Versión del proyecto:** 1.0.0
