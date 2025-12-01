---
sidebar_position: 1
---

# Diagrama ERD

## Modelo Completo

```mermaid
erDiagram
    User ||--o{ BusinessUser : "tiene roles en"
    User ||--o{ Appointment : "reserva como cliente"
    User ||--o{ BusinessCustomer : "es cliente de"

    Business ||--o{ BusinessUser : "tiene empleados"
    Business ||--o{ Service : "ofrece"
    Business ||--o{ ServiceCategory : "categoriza"
    Business ||--o{ Appointment : "recibe"
    Business ||--o{ BusinessCustomer : "tiene clientes"

    BusinessUser ||--o{ EmployeeService : "ofrece servicios"
    BusinessUser ||--o{ EmployeeAvailability : "tiene horarios"
    BusinessUser ||--o{ EmployeeException : "tiene excepciones"
    BusinessUser ||--o{ Appointment : "atiende como proveedor"

    ServiceCategory ||--o{ Service : "contiene"
    Service ||--o{ EmployeeService : "es ofrecido por"
    Service ||--o{ Appointment : "se reserva"

    User {
        string id PK "Firebase UID"
        string email UK
        string firstName
        string lastName
        enum status "hidden|visible|disabled|blocked"
        enum type "customer|admin|superadmin"
        string phone
        string timeZone
        datetime createdAt
    }

    Business {
        uuid id PK
        string title
        string slug UK
        string description
        enum status "active|inactive|suspended"
        string locale
        string currency
        string timeZone
        string address
        string city
        string country
        float lat
        float lng
        datetime createdAt
    }

    BusinessUser {
        uuid id PK
        string userId FK
        uuid businessId FK
        enum role "MANAGER|EMPLOYEE"
        string displayName
        boolean isActive
        datetime createdAt
    }

    Service {
        uuid id PK
        uuid businessId FK
        uuid categoryId FK
        string name
        string description
        int durationMinutes
        decimal price
        string currency
        boolean isActive
        int sortOrder
    }

    ServiceCategory {
        uuid id PK
        uuid businessId FK
        string name
        string description
        int sortOrder
    }

    EmployeeService {
        uuid businessUserId FK
        uuid serviceId FK
        uuid businessId FK
    }

    EmployeeAvailability {
        uuid id PK
        uuid businessUserId FK
        int dayOfWeek "0-6"
        time startTime
        time endTime
    }

    EmployeeException {
        uuid id PK
        uuid businessUserId FK
        date date
        boolean isAllDay
        time startTime
        time endTime
        boolean isAvailable
        string reason
    }

    Appointment {
        uuid id PK
        string customerId FK
        uuid providerBusinessUserId FK
        uuid businessId FK
        uuid serviceId FK
        datetime startTime
        datetime endTime
        boolean isGroup
        int capacity
        enum status "scheduled|confirmed|completed|cancelled"
        string notes
    }

    BusinessCustomer {
        uuid id PK
        string userId FK
        uuid businessId FK
        string note
        string source "booking|manual|import"
    }

    CasbinRule {
        int id PK
        string ptype
        string v0 "subject"
        string v1 "domain"
        string v2 "object"
        string v3 "action"
    }
```

## Relaciones Clave

### User - Business (N:M via BusinessUser)

```mermaid
flowchart LR
    User["User<br/>(Firebase UID)"]
    BU["BusinessUser<br/>(role: MANAGER|EMPLOYEE)"]
    Business["Business<br/>(UUID)"]

    User -->|1:N| BU
    BU -->|N:1| Business

    BU -.->|si EMPLOYEE| ES["EmployeeService"]
    BU -.->|si EMPLOYEE| EA["EmployeeAvailability"]
    BU -.->|si EMPLOYEE| EE["EmployeeException"]
```

### Flujo de Appointment

```mermaid
flowchart TB
    Customer["Customer<br/>(User)"]
    Provider["Provider<br/>(BusinessUser)"]
    Business["Business"]
    Service["Service"]
    Appointment["Appointment"]

    Customer -->|reserva| Appointment
    Provider -->|atiende| Appointment
    Business -->|recibe| Appointment
    Service -->|se reserva en| Appointment
```

## Enums

### UserStatus

| Valor | Descripción |
|-------|-------------|
| `hidden` | Usuario oculto (recién creado) |
| `visible` | Usuario visible y activo |
| `disabled` | Usuario deshabilitado |
| `blocked` | Usuario bloqueado |

### BusinessStatus

| Valor | Descripción |
|-------|-------------|
| `active` | Negocio activo y visible |
| `inactive` | Negocio inactivo |
| `suspended` | Negocio suspendido |

### BusinessRole

| Valor | Descripción |
|-------|-------------|
| `MANAGER` | Administrador del negocio |
| `EMPLOYEE` | Empleado que ofrece servicios |

### AppointmentStatus

```mermaid
stateDiagram-v2
    [*] --> scheduled: Crear cita
    scheduled --> confirmed: Confirmar
    scheduled --> cancelled: Cancelar
    confirmed --> completed: Completar
    confirmed --> cancelled: Cancelar
    completed --> [*]
    cancelled --> [*]
```
