# Plan de cambios — Marketing & Landing

> Generado: 2026-04-23  
> Estado: En progreso

---

## Contexto del producto (etapa actual)

- **Modo testing / acceso anticipado**: los negocios no pueden registrarse solos. El equipo de tuAgenda crea las cuentas manualmente e incluye un onboarding + capacitación.
- **Los clientes de los negocios SÍ** pueden crear su propia cuenta y ver sus citas (es gratis para ellos).
- **Canal de contacto principal**: WhatsApp. Los interesados se unen a una lista de espera via Google Forms (URL en `.env` → `NEXT_PUBLIC_WAITLIST_FORM_URL`).
- **Sin períodos de prueba de X días**: acceso gratuito limitado a un número selecto de negocios.

---

## Checklist de cambios

### 1. Global / Traducciones (`es.ts` + `en.ts`)

- [ ] Eliminar todas las referencias a "14 días gratis" / "14-day free trial"
- [ ] Eliminar "Regístrate en menos de X minutos"
- [ ] Reemplazar "Comenzar Prueba Gratuita" → "Unirse a la lista de espera"
- [ ] Reemplazar "Comenzar Gratis" / "Start Free Trial" → "Unirse a la lista de espera"
- [ ] `cancelAnytime` → "Plazas limitadas"
- [ ] FAQ q1 ("¿Es gratis?") → reflejar acceso anticipado limitado
- [ ] Añadir variable `NEXT_PUBLIC_WAITLIST_FORM_URL` al `.env.example` y `.env.local`

### 2. Landing principal (`/`)

- [ ] Añadir badge/texto: "tuAgenda es gratis para los clientes de los negocios"
- [ ] Cambiar flujo explicado: negocios contactan por WhatsApp → nosotros creamos la cuenta + onboarding
- [ ] Botón CTA principal → "Unirse a la lista de espera" (abre Google Forms en nueva pestaña)
- [ ] Botón secundario → "Hablar por WhatsApp"
- [ ] Eliminar sección "Historias de éxito" / Testimonios
- [ ] Eliminar mención "regístrate en menos de X minutos" del paso de "Crea tu cuenta"
- [ ] Actualizar paso 1 del how-it-works: "Contáctanos → onboarding → cuenta lista"
- [ ] Casos de uso: reusar imágenes existentes del landing (`/images/landing/`)

### 3. Página de precios (`/pricing`)

- [ ] Añadir banner "Precios muy pronto — acceso anticipado gratuito"
- [ ] Mantener estructura mensual/anual (toggle)
- [ ] **Plan Gratuito** — "Para empezar":
  - 1 usuario
  - 20 citas/mes (presenciales y online)
  - Integración Google Calendar
  - Solo pago presencial
  - Notificaciones por email ✓
  - Notificaciones por WhatsApp: no incluidas (add-on)
  - Soporte por email
  - Reportes básicos
- [ ] **Plan Equipo** — S/120/mes hasta 5 usuarios:
  - 5 usuarios
  - 500 citas/mes
  - Pasarelas de pago ✓
  - 500 notificaciones WhatsApp/mes (add-on disponible)
  - Soporte prioritario
  - Todo lo del plan gratuito
- [ ] **Plan Pro** — precio por definir, todo ilimitado:
  - Usuarios ilimitados
  - Citas ilimitadas
  - Notificaciones WhatsApp ilimitadas
  - Pasarelas de pago ✓
  - Cupones de descuento ✓
  - Ubicaciones ilimitadas ✓
  - Soporte prioritario
- [ ] CTA de cada plan → "Unirse a la lista de espera" (Google Forms)

### 4. Integraciones

- [ ] Eliminar "Integraciones" del menú de navegación
- [ ] Eliminar la página `/integrations` (o redirigir a 404/home)

### 5. Casos de uso (`/industries`)

- [ ] Reusar imágenes de `/images/landing/` donde haya match
- [ ] Dejar sin imagen las secciones que no tengan match (como estaban)

### 6. Páginas de features (`/features/*`)

- [ ] Reemplazar todos los botones "Start Free Trial" → "Unirse a la lista de espera"
- [ ] Eliminar menciones a períodos de prueba en descripciones

### 7. Página de contacto (`/contact`) ✅ (ya tiene WhatsApp)

- [ ] Actualizar FAQ: "¿Cómo funciona el acceso?" → respuesta con lista de espera

### 8. Página "Nosotros" (`/about-us`)

- [ ] **PENDIENTE**: necesita info real del equipo (ver preguntas abajo)

---

## Preguntas pendientes — "Nosotros"

Antes de modificar `/about-us` se necesita:

1. ¿Cuándo fue fundada tuAgenda y en qué país?
2. ¿Quiénes son los fundadores? (nombres y roles)
3. ¿Cuál es la misión real en una frase?
4. ¿Tienen métricas reales? (negocios activos, citas gestionadas, etc.)
5. ¿Qué diferencia a tuAgenda de otras herramientas similares?

---

## Variables de entorno nuevas

```env
# Google Forms - Lista de espera
NEXT_PUBLIC_WAITLIST_FORM_URL=
```

---

## Notas técnicas

- El botón "lista de espera" debe abrir `NEXT_PUBLIC_WAITLIST_FORM_URL` en `target="_blank"`
- Si la variable no está definida, el botón debe hacer fallback al WhatsApp de soporte
- Las imágenes disponibles en `/images/landing/`:
  - `nutricionista.png`
  - `psicologa.png`
  - `psicologo.png`
  - `english teacher.png`
  - `maestra de violin.png`
  - `banner1.png`
