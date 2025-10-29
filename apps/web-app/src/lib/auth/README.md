# Sistema de Autenticación

Este módulo proporciona una capa de abstracción para la autenticación, permitiendo cambiar fácilmente de proveedor (Firebase, Auth0, etc.) sin modificar el código de la aplicación.

## Arquitectura

```
src/lib/auth/
├── types.ts                    # Interfaces y tipos
├── auth-service.ts             # Capa de abstracción principal
└── firebase/
    ├── config.ts               # Configuración de Firebase
    └── firebase-auth-service.ts # Implementación de Firebase
```

## Características

- **Modular**: Todo el código de Firebase está aislado en `firebase/`
- **Abstracto**: Usa interfaces para permitir cambiar de proveedor fácilmente
- **Type-safe**: Completamente tipado con TypeScript
- **React Context**: Proveedor de contexto para acceso global al estado de autenticación

## Configuración

1. Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Configura las variables de Firebase en `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_dominio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_bucket.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

3. El `AuthProvider` ya está configurado en el layout raíz (`src/app/layout.tsx`), por lo que está disponible en todas las páginas.

## Uso

### En componentes React

```tsx
import { useAuth } from "@/contexts";

function LoginForm() {
  const { signIn, user, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({
        email: "user@example.com",
        password: "password123",
      });
      // Usuario autenticado
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return <form onSubmit={handleSubmit}>{/* Tu formulario aquí */}</form>;
}
```

### Métodos disponibles en useAuth()

```tsx
const {
  // Estado
  user, // Usuario actual o null
  loading, // true mientras se verifica la autenticación
  error, // Error si ocurrió alguno

  // Métodos
  signIn, // Iniciar sesión
  signUp, // Registrarse
  signOut, // Cerrar sesión
  sendPasswordResetEmail, // Enviar email de recuperación
  updateProfile, // Actualizar perfil del usuario
} = useAuth();
```

### Uso directo del servicio (sin React)

Si necesitas usar la autenticación fuera de componentes React:

```ts
import { authService } from "@/lib/auth/auth-service";

// Iniciar sesión
await authService.signIn({
  email: "user@example.com",
  password: "password123",
});

// Registrarse
await authService.signUp({
  email: "user@example.com",
  password: "password123",
  displayName: "Usuario",
});

// Cerrar sesión
await authService.signOut();

// Obtener usuario actual
const user = authService.getCurrentUser();

// Escuchar cambios de autenticación
const unsubscribe = authService.onAuthStateChanged((user) => {
  console.log("Usuario cambió:", user);
});
// No olvides cancelar la suscripción
unsubscribe();
```

## Ejemplo completo: Página de Login

```tsx
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ email, password });
      router.push("/dashboard");
    } catch (err) {
      // Error ya está en el estado del contexto
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Cargando..." : "Iniciar Sesión"}
      </button>
    </form>
  );
}
```

## Cambiar de proveedor de autenticación

Para cambiar de Firebase a otro proveedor (por ejemplo, Auth0):

1. Crea una nueva implementación en `src/lib/auth/auth0/auth0-auth-service.ts`
2. Implementa la interfaz `IAuthService`
3. Cambia la instancia en `src/lib/auth/auth-service.ts`:

```ts
// Antes
authServiceInstance = new FirebaseAuthService();

// Después
authServiceInstance = new Auth0AuthService();
```

El resto de tu aplicación seguirá funcionando sin cambios.

## Proteger rutas

Para proteger rutas privadas, puedes crear un componente de guard:

```tsx
"use client";

import { useAuth } from "@/contexts";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <div>Verificando autenticación...</div>;
  if (!user) return null;

  return <>{children}</>;
}
```

Luego úsalo en tus layouts de rutas privadas:

```tsx
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
```
