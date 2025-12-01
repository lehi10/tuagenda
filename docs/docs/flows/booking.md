---
sidebar_position: 2
---

# Flujo de Booking

## Visión General

El flujo de booking permite a los clientes reservar citas con proveedores de servicios.

```mermaid
flowchart LR
    subgraph Customer["Cliente"]
        Select["Seleccionar<br/>Servicio"]
        Provider["Elegir<br/>Proveedor"]
        Time["Elegir<br/>Horario"]
        Confirm["Confirmar<br/>Reserva"]
    end

    subgraph System["Sistema"]
        Validate["Validar<br/>Disponibilidad"]
        Create["Crear<br/>Appointment"]
        Notify["Notificar"]
    end

    Select --> Provider
    Provider --> Time
    Time --> Validate
    Validate --> Confirm
    Confirm --> Create
    Create --> Notify
```

## Flujo Completo

```mermaid
sequenceDiagram
    actor C as Cliente
    participant P as Booking Page
    participant API as tRPC API
    participant DB as Database

    C->>P: Accede a /b/[slug]
    P->>API: getBusinessBySlug(slug)
    API->>DB: SELECT * FROM businesses WHERE slug = ?
    DB-->>API: Business
    API-->>P: Business data

    P->>API: getServices(businessId)
    API->>DB: SELECT * FROM services WHERE businessId = ?
    DB-->>API: Services[]
    API-->>P: Lista de servicios

    C->>P: Selecciona servicio
    P->>API: getProvidersForService(serviceId)
    API->>DB: Query employee_services + business_users
    DB-->>API: Providers[]
    API-->>P: Lista de proveedores

    C->>P: Selecciona proveedor
    P->>API: getAvailability(providerId, date)
    API->>DB: Query availability + exceptions + appointments
    DB-->>API: Available slots
    API-->>P: Horarios disponibles

    C->>P: Selecciona horario
    C->>P: Confirma reserva
    P->>API: createAppointment(data)
    API->>DB: INSERT INTO appointments
    DB-->>API: Appointment created
    API-->>P: Success
    P-->>C: Confirmación
```

## Cálculo de Disponibilidad

```mermaid
flowchart TB
    subgraph Input["Entrada"]
        Provider["Provider ID"]
        Date["Fecha"]
        Service["Service ID"]
    end

    subgraph Process["Proceso"]
        GetAvail["Obtener<br/>EmployeeAvailability"]
        GetExcept["Obtener<br/>EmployeeExceptions"]
        GetAppts["Obtener<br/>Appointments existentes"]
        Generate["Generar<br/>slots disponibles"]
    end

    subgraph Output["Salida"]
        Slots["TimeSlot[]"]
    end

    Provider --> GetAvail
    Date --> GetAvail
    Date --> GetExcept
    Date --> GetAppts
    Service --> Generate

    GetAvail --> Generate
    GetExcept --> Generate
    GetAppts --> Generate
    Generate --> Slots
```

### Algoritmo de Slots

```typescript
function getAvailableSlots(
  providerId: string,
  date: Date,
  serviceDuration: number
): TimeSlot[] {
  // 1. Obtener disponibilidad del día
  const dayOfWeek = date.getDay();
  const availability = await getEmployeeAvailability(providerId, dayOfWeek);

  // 2. Obtener excepciones del día
  const exceptions = await getEmployeeExceptions(providerId, date);

  // 3. Obtener citas existentes
  const appointments = await getAppointments(providerId, date);

  // 4. Generar slots
  const slots: TimeSlot[] = [];

  for (const period of availability) {
    let current = period.startTime;

    while (current + serviceDuration <= period.endTime) {
      const slot = { start: current, end: current + serviceDuration };

      // Verificar si está bloqueado por excepción
      if (!isBlockedByException(slot, exceptions)) {
        // Verificar si hay conflicto con cita existente
        if (!hasConflict(slot, appointments)) {
          slots.push(slot);
        }
      }

      current += SLOT_INCREMENT; // ej: 15 minutos
    }
  }

  return slots;
}
```

## Estados de Appointment

```mermaid
stateDiagram-v2
    [*] --> scheduled: Cliente reserva

    scheduled --> confirmed: Negocio confirma
    scheduled --> cancelled: Cliente/Negocio cancela

    confirmed --> completed: Servicio completado
    confirmed --> cancelled: Cancelación tardía
    confirmed --> noshow: Cliente no asiste

    completed --> [*]
    cancelled --> [*]
    noshow --> [*]

    note right of scheduled: Estado inicial automático
    note right of confirmed: Requiere confirmación manual o automática
    note right of completed: Marcado por el proveedor
```

## Componentes del Booking

```mermaid
flowchart TB
    subgraph BookingPage["Booking Page"]
        BP["BookingProvider<br/>(Context)"]

        subgraph Steps["Pasos"]
            S1["ServiceSelection"]
            S2["ProviderSelection"]
            S3["DateTimeSelection"]
            S4["ConfirmationStep"]
        end

        BP --> Steps
    end

    subgraph Hooks["Hooks"]
        H1["useBookingFlow"]
        H2["useAvailability"]
        H3["useCreateAppointment"]
    end

    S1 --> H1
    S2 --> H1
    S3 --> H2
    S4 --> H3
```

### useBookingFlow Hook

```typescript
// client/hooks/use-booking-flow.ts
export function useBookingFlow() {
  const [step, setStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const canProceed = useMemo(() => {
    switch (step) {
      case 'service': return !!selectedService;
      case 'provider': return !!selectedProvider;
      case 'datetime': return !!selectedSlot;
      case 'confirmation': return true;
    }
  }, [step, selectedService, selectedProvider, selectedSlot]);

  const nextStep = () => {
    const steps: BookingStep[] = ['service', 'provider', 'datetime', 'confirmation'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  return {
    step,
    selectedService,
    selectedProvider,
    selectedSlot,
    setSelectedService,
    setSelectedProvider,
    setSelectedSlot,
    canProceed,
    nextStep,
  };
}
```

## Validaciones

### Al Crear Appointment

```mermaid
flowchart TB
    Start["Crear Appointment"]

    Start --> V1{"Servicio activo?"}
    V1 -->|No| E1["Error: Servicio no disponible"]
    V1 -->|Sí| V2{"Proveedor ofrece servicio?"}

    V2 -->|No| E2["Error: Proveedor no válido"]
    V2 -->|Sí| V3{"Slot disponible?"}

    V3 -->|No| E3["Error: Horario no disponible"]
    V3 -->|Sí| V4{"Dentro de horario?"}

    V4 -->|No| E4["Error: Fuera de horario"]
    V4 -->|Sí| V5{"Sin excepción?"}

    V5 -->|No| E5["Error: Proveedor no disponible"]
    V5 -->|Sí| Create["Crear Appointment"]
```

### Reglas de Negocio

| Regla | Descripción |
|-------|-------------|
| Anticipación mínima | No reservar con menos de X horas de anticipación |
| Anticipación máxima | No reservar con más de X días de anticipación |
| Horario de negocio | Solo dentro del horario del negocio |
| Disponibilidad | Solo cuando el proveedor está disponible |
| Sin conflictos | No superponer con citas existentes |

## Notificaciones

```mermaid
flowchart LR
    Create["Appointment Creado"]

    Create --> N1["Email al Cliente"]
    Create --> N2["Email al Proveedor"]
    Create --> N3["Push Notification"]

    subgraph Reminder["Recordatorios"]
        R1["24h antes"]
        R2["1h antes"]
    end

    Create -.-> Reminder
```
