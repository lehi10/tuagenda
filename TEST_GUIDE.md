# Guía de Prueba - Arquitectura Hexagonal

## 🚀 Inicio Rápido

```bash
# 1. Asegúrate de que la base de datos esté corriendo
pnpm db:start

# 2. Inicia la aplicación
pnpm dev

# 3. Abre el navegador
# http://localhost:3001
```

## ✅ Prueba 1: Registro de Usuario

### Pasos:
1. Ve a http://localhost:3001/signup
2. Completa el formulario:
   - First Name: `Juan`
   - Last Name: `Pérez`
   - Email: `juan.perez@test.com`
   - Password: `Test123456`
3. Click en "Sign Up"

### ✅ Qué esperar:
- Serás redirigido a `/dashboard`
- Verás tu nombre en el header/navbar
- En la consola del servidor verás:
  ```
  [INFO] CreateUserUseCase - Creating user with email: juan.perez@test.com
  [INFO] CreateUserUseCase - User created successfully
  ```

### 🔍 Lo que sucede por dentro:
```
signup-form.tsx
    ↓
createUserAction() [Server Action]
    ↓
CreateUserUseCase.execute()
    ↓
new User({ ... }) [Domain Entity]
    ↓
PrismaUserRepository.create()
    ↓
prisma.user.create()
    ↓
PostgreSQL ✅
```

---

## ✅ Prueba 2: Login con Google

### Pasos:
1. Ve a http://localhost:3001/login
2. Click en "Sign in with Google"
3. Autoriza con tu cuenta Google

### ✅ Qué esperar:
- Si es primera vez: Se crea usuario automáticamente
- Serás redirigido a `/dashboard`
- Tus datos de Google se sincronizan en PostgreSQL

### 🔍 Lo que sucede por dentro:
```
use-google-auth.ts
    ↓
Firebase Google OAuth
    ↓
createUserAction() [Mismo flujo]
    ↓
CreateUserUseCase
    ↓
PostgreSQL ✅
```

---

## ✅ Prueba 3: Navegación (Cargar Usuario)

### Pasos:
1. Una vez logueado, navega por la app:
   - `/dashboard`
   - `/profile`
   - `/business`
   - `/calendar`

### ✅ Qué esperar:
- Tus datos aparecen correctamente en cada página
- El AuthContext carga tu información
- En la consola del servidor verás:
  ```
  [INFO] GetUserUseCase - Fetching user with ID: firebase-uid-xxx
  [INFO] GetUserUseCase - User retrieved successfully
  ```

### 🔍 Lo que sucede por dentro:
```
AuthContext.tsx (en cada cambio de ruta)
    ↓
getUserByIdAction() [Server Action]
    ↓
GetUserUseCase.execute()
    ↓
PrismaUserRepository.findById()
    ↓
prisma.user.findUnique()
    ↓
UserMapper.toDomain() [Convierte Prisma → Domain]
    ↓
User Entity devuelta al contexto ✅
```

---

## ✅ Prueba 4: Verificar en la Base de Datos

### Pasos:
```bash
# Abre Prisma Studio
pnpm db:studio
```

1. Ve a la tabla `users`
2. Verás el usuario que creaste
3. Campos importantes:
   - `id`: Firebase UID
   - `email`: Email del usuario
   - `firstName`, `lastName`: Nombres
   - `status`: "visible"
   - `type`: "customer"
   - `createdAt`, `updatedAt`: Timestamps

### ✅ Qué esperar:
```sql
id: "abc123-firebase-uid"
email: "juan.perez@test.com"
firstName: "Juan"
lastName: "Pérez"
status: "visible"
type: "customer"
createdAt: 2025-11-01T...
updatedAt: 2025-11-01T...
```

---

## 🔍 Verificación con DevTools

### Chrome DevTools:
1. Abre DevTools (F12)
2. Ve a la pestaña **Network**
3. Filtra por **Fetch/XHR**
4. Haz signup/login
5. Busca llamadas a:
   - `createUserAction`
   - `getUserByIdAction`

### Ejemplo de Request/Response:
```json
// Request a createUserAction
{
  "id": "firebase-uid-123",
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User"
}

// Response
{
  "success": true,
  "userId": "firebase-uid-123"
}
```

---

## 🐛 Debugging

### Ver logs detallados:
Los logs están configurados en el logger. Verás en consola:

```
[INFO] CreateUserUseCase firebase-uid-123 Creating user with email: test@example.com
[INFO] CreateUserUseCase firebase-uid-123 Creating User domain entity
[INFO] CreateUserUseCase firebase-uid-123 Persisting user to database
[INFO] CreateUserUseCase firebase-uid-123 User created successfully
```

### Errores comunes y soluciones:

#### ❌ Error: "Email is already taken"
**Causa:** Ya existe un usuario con ese email
**Solución:** Usa otro email o elimina el usuario de la DB

#### ❌ Error: "User not found in database"
**Causa:** El usuario no se creó correctamente en PostgreSQL
**Solución:** Verifica que la base de datos esté corriendo (`pnpm db:start`)

#### ❌ Error: "Can't reach database server"
**Causa:** PostgreSQL no está corriendo
**Solución:**
```bash
pnpm db:start
pnpm db:status  # Verificar estado
```

---

## 📊 Checklist de Verificación

Marca cada item cuando lo compruebes:

### Funcionalidad:
- [ ] ✅ Registro con email funciona
- [ ] ✅ Login con Google funciona
- [ ] ✅ Datos del usuario se cargan en dashboard
- [ ] ✅ Usuario aparece en Prisma Studio
- [ ] ✅ Build exitoso (`pnpm build`)

### Arquitectura:
- [ ] ✅ Server Actions usan Use Cases
- [ ] ✅ Use Cases usan Repository (interface)
- [ ] ✅ Repository usa Prisma
- [ ] ✅ Entities del dominio tienen lógica de negocio
- [ ] ✅ No hay 'any' en el código
- [ ] ✅ AuthContext funciona sin cambios

### Performance:
- [ ] ✅ La app carga rápido
- [ ] ✅ No hay errores en consola
- [ ] ✅ No hay memory leaks

---

## 🎯 Prueba Avanzada: Testing de Entidad

Si quieres probar la lógica de negocio de la entidad User:

```bash
# Abre Node REPL
node --loader ts-node/esm

# Importa la entidad
const { User, UserStatus, UserType } = require('./src/core/domain/entities/User');

# Crea un usuario
const user = new User({
  id: 'test-123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe'
});

# Prueba métodos de negocio
console.log(user.fullName);        // "John Doe"
console.log(user.isActive());      // true
console.log(user.isAdmin());       // false

# Prueba cambios de estado
user.block();
console.log(user.isBlocked());     // true
console.log(user.status);          // "blocked"

user.updateProfile({
  firstName: 'Jane'
});
console.log(user.fullName);        // "Jane Doe"
```

---

## 🚀 Siguiente Nivel

Una vez que compruebes que todo funciona:

1. **Refactoriza otra entidad** (Business, Appointment)
2. **Agrega más use cases** (UpdateUser, DeleteUser)
3. **Implementa tests unitarios**
4. **Agrega un DI Container**

---

## 📝 Notas Finales

### ¿Qué NO ha cambiado?
- ✅ La UI sigue igual
- ✅ Los componentes funcionan igual
- ✅ El AuthContext funciona igual
- ✅ Firebase Auth funciona igual

### ¿Qué SÍ ha cambiado?
- ✅ Server Actions ahora usan Use Cases
- ✅ Use Cases encapsulan lógica de negocio
- ✅ Repository abstrae Prisma
- ✅ Entities del dominio tienen métodos de negocio
- ✅ Código más mantenible y testeable

---

**¿Todo funciona?** 🎉
Si todas las pruebas pasan, la refactorización fue exitosa.
