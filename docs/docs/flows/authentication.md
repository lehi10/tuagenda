---
sidebar_position: 1
---

# Flujo de Autenticación

## Visión General

TuAgenda usa **Firebase Authentication** para autenticación y **PostgreSQL** para almacenar datos del usuario.

```mermaid
flowchart TB
    subgraph Client["Cliente (Browser)"]
        UI["Login/Signup Form"]
        AuthCtx["AuthContext"]
    end

    subgraph Firebase["Firebase"]
        FAuth["Firebase Auth"]
    end

    subgraph Server["Servidor (Next.js)"]
        Action["Server Action"]
        UseCase["CreateUser UseCase"]
    end

    subgraph DB["Base de Datos"]
        PG[(PostgreSQL)]
    end

    UI --> FAuth
    FAuth --> AuthCtx
    AuthCtx --> Action
    Action --> UseCase
    UseCase --> PG
```

## Registro de Usuario

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as SignupForm
    participant FB as Firebase Auth
    participant AC as AuthContext
    participant SA as Server Action
    participant UC as CreateUserUseCase
    participant R as UserRepository
    participant DB as PostgreSQL

    U->>F: Ingresa email/password
    F->>FB: createUserWithEmailAndPassword()
    FB-->>F: Firebase User (UID)

    F->>SA: createUserAction({ uid, email, ... })
    SA->>UC: execute(userData)

    UC->>R: findByEmail(email)
    R->>DB: SELECT * FROM users WHERE email = ?
    DB-->>R: null (no existe)
    R-->>UC: null

    UC->>R: create(userData)
    R->>DB: INSERT INTO users (id, email, ...)
    DB-->>R: User created
    R-->>UC: User entity
    UC-->>SA: User

    SA-->>F: { success: true, user }
    F->>AC: setUser(user)
    AC-->>U: Redirige a /dashboard
```

### Código de Registro

```typescript
// client/features/auth/components/signup-form.tsx
const handleSignup = async (data: SignupFormData) => {
  try {
    // 1. Crear usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // 2. Crear usuario en PostgreSQL
    await createUserAction({
      id: userCredential.user.uid,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    // 3. Redirigir
    router.push('/dashboard');
  } catch (error) {
    // Handle error
  }
};
```

## Inicio de Sesión

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as LoginForm
    participant FB as Firebase Auth
    participant AC as AuthContext
    participant SA as Server Action
    participant DB as PostgreSQL

    U->>F: Ingresa email/password
    F->>FB: signInWithEmailAndPassword()
    FB-->>F: Firebase User (UID)

    F->>SA: getUserAction(uid)
    SA->>DB: SELECT * FROM users WHERE id = ?
    DB-->>SA: User data

    SA-->>F: User
    F->>AC: setUser(user)
    AC-->>U: Redirige a /dashboard
```

## OAuth (Google)

```mermaid
sequenceDiagram
    actor U as Usuario
    participant F as LoginForm
    participant G as Google
    participant FB as Firebase Auth
    participant SA as Server Action
    participant DB as PostgreSQL

    U->>F: Click "Continuar con Google"
    F->>FB: signInWithPopup(GoogleProvider)
    FB->>G: OAuth flow
    G-->>FB: Google token
    FB-->>F: Firebase User

    alt Usuario nuevo
        F->>SA: createUserAction(userData)
        SA->>DB: INSERT INTO users
    else Usuario existente
        F->>SA: getUserAction(uid)
        SA->>DB: SELECT * FROM users
    end

    SA-->>F: User
    F-->>U: Redirige a /dashboard
```

## AuthContext

El contexto de autenticación mantiene el estado global del usuario.

```mermaid
stateDiagram-v2
    [*] --> Loading: App inicia

    Loading --> Authenticated: Firebase detecta sesión
    Loading --> Unauthenticated: No hay sesión

    Unauthenticated --> Authenticated: Login exitoso
    Authenticated --> Unauthenticated: Logout

    Authenticated --> Loading: Token expira
    Loading --> Authenticated: Token renovado
```

```typescript
// client/contexts/auth-context.tsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios de autenticación
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Obtener datos completos del usuario
        const userData = await getUserAction(firebaseUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

## Protección de Rutas

```mermaid
flowchart TB
    Request["Request a ruta privada"]

    Request --> Check{"Usuario autenticado?"}

    Check -->|No| Redirect["Redirigir a /login"]
    Check -->|Sí| Permission{"Tiene permiso?"}

    Permission -->|No| Forbidden["403 Forbidden"]
    Permission -->|Sí| Render["Renderizar página"]
```

### Middleware de Autenticación

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request);

  if (!session && request.nextUrl.pathname.startsWith('/(private)')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

## Logout

```mermaid
sequenceDiagram
    actor U as Usuario
    participant AC as AuthContext
    participant FB as Firebase Auth
    participant R as Router

    U->>AC: logout()
    AC->>FB: signOut()
    FB-->>AC: Success
    AC->>AC: setUser(null)
    AC->>R: router.push('/login')
    R-->>U: Página de login
```

## Manejo de Errores

| Error | Causa | Solución |
|-------|-------|----------|
| `auth/email-already-in-use` | Email ya registrado | Mostrar mensaje, sugerir login |
| `auth/weak-password` | Contraseña débil | Mostrar requisitos |
| `auth/user-not-found` | Usuario no existe | Sugerir registro |
| `auth/wrong-password` | Contraseña incorrecta | Mostrar error, ofrecer reset |
| `auth/too-many-requests` | Rate limit | Esperar, mostrar contador |
