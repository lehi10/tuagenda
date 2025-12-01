---
sidebar_position: 3
---

# Flujo CRUD con tRPC

## Visión General

tRPC proporciona una API type-safe entre cliente y servidor.

```mermaid
flowchart LR
    subgraph Client["Cliente"]
        Hook["React Query Hook"]
        TRPC["tRPC Client"]
    end

    subgraph Server["Servidor"]
        Router["tRPC Router"]
        Procedure["Procedure"]
        UseCase["Use Case"]
    end

    subgraph DB["Base de Datos"]
        Repo["Repository"]
        Prisma["Prisma"]
    end

    Hook --> TRPC
    TRPC -->|HTTP| Router
    Router --> Procedure
    Procedure --> UseCase
    UseCase --> Repo
    Repo --> Prisma
```

## Estructura de tRPC

```
src/server/trpc/
├── index.ts              # Export del router
├── trpc.ts               # Contexto y middleware
├── server.ts             # Server-side caller
├── procedures.ts         # Procedimientos reutilizables
├── middlewares/
│   ├── auth.middleware.ts
│   └── logging.middleware.ts
└── routers/
    ├── app.router.ts     # Root router
    ├── user.router.ts
    ├── business.router.ts
    ├── service.router.ts
    └── appointment.router.ts
```

## Flujo de Request

```mermaid
sequenceDiagram
    participant C as Component
    participant H as useQuery/useMutation
    participant T as tRPC Client
    participant R as tRPC Router
    participant M as Middleware
    participant P as Procedure
    participant U as Use Case
    participant D as Database

    C->>H: trpc.service.getAll.useQuery()
    H->>T: Crear request
    T->>R: POST /api/trpc/service.getAll
    R->>M: Ejecutar middleware (auth)
    M->>P: Ejecutar procedure
    P->>U: Llamar Use Case
    U->>D: Query
    D-->>U: Data
    U-->>P: Result
    P-->>R: Response
    R-->>T: JSON
    T-->>H: Typed data
    H-->>C: { data, isLoading, error }
```

## Ejemplo: CRUD de Servicios

### Router

```typescript
// src/server/trpc/routers/service.router.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { CreateServiceUseCase } from '@/server/core/application/use-cases/service/CreateService';

export const serviceRouter = router({
  // CREATE
  create: protectedProcedure
    .input(z.object({
      businessId: z.string().uuid(),
      name: z.string().min(1),
      description: z.string().optional(),
      durationMinutes: z.number().min(5),
      price: z.number().min(0),
      currency: z.string().default('USD'),
    }))
    .mutation(async ({ input, ctx }) => {
      const useCase = new CreateServiceUseCase(ctx.serviceRepository);
      return useCase.execute(input);
    }),

  // READ (list)
  getAll: protectedProcedure
    .input(z.object({
      businessId: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      return ctx.serviceRepository.findByBusinessId(input.businessId);
    }),

  // READ (single)
  getById: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ input, ctx }) => {
      return ctx.serviceRepository.findById(input.id);
    }),

  // UPDATE
  update: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
      name: z.string().min(1).optional(),
      description: z.string().optional(),
      durationMinutes: z.number().min(5).optional(),
      price: z.number().min(0).optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      return ctx.serviceRepository.update(id, data);
    }),

  // DELETE
  delete: protectedProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.serviceRepository.delete(input.id);
    }),
});
```

### Cliente

```typescript
// client/features/services/hooks/use-services.ts
import { trpc } from '@/client/lib/trpc';

export function useServices(businessId: string) {
  return trpc.service.getAll.useQuery({ businessId });
}

export function useCreateService() {
  const utils = trpc.useUtils();

  return trpc.service.create.useMutation({
    onSuccess: () => {
      // Invalidar cache para refrescar lista
      utils.service.getAll.invalidate();
    },
  });
}

export function useUpdateService() {
  const utils = trpc.useUtils();

  return trpc.service.update.useMutation({
    onSuccess: (data) => {
      // Actualizar cache optimísticamente
      utils.service.getById.setData({ id: data.id }, data);
      utils.service.getAll.invalidate();
    },
  });
}

export function useDeleteService() {
  const utils = trpc.useUtils();

  return trpc.service.delete.useMutation({
    onSuccess: () => {
      utils.service.getAll.invalidate();
    },
  });
}
```

### Componente

```typescript
// client/features/services/components/service-list.tsx
export function ServiceList({ businessId }: { businessId: string }) {
  const { data: services, isLoading } = useServices(businessId);
  const createService = useCreateService();
  const deleteService = useDeleteService();

  if (isLoading) return <Skeleton />;

  return (
    <div>
      {services?.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onDelete={() => deleteService.mutate({ id: service.id })}
        />
      ))}
    </div>
  );
}
```

## Middleware

```mermaid
flowchart LR
    Request["Request"]

    subgraph Middlewares["Middlewares"]
        M1["Logging"]
        M2["Auth"]
        M3["Permission"]
    end

    Request --> M1
    M1 --> M2
    M2 --> M3
    M3 --> Procedure["Procedure"]
```

### Auth Middleware

```typescript
// src/server/trpc/trpc.ts
const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.session.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

## Manejo de Errores

```mermaid
flowchart TB
    Error["Error en Procedure"]

    Error --> Type{"Tipo de error?"}

    Type -->|Validación| V["ZodError"]
    Type -->|Auth| A["UNAUTHORIZED"]
    Type -->|Permiso| P["FORBIDDEN"]
    Type -->|No encontrado| N["NOT_FOUND"]
    Type -->|Otro| O["INTERNAL_SERVER_ERROR"]

    V --> Client["Cliente recibe error tipado"]
    A --> Client
    P --> Client
    N --> Client
    O --> Client
```

```typescript
// Manejo en el cliente
const createService = useCreateService();

const handleSubmit = async (data: ServiceForm) => {
  try {
    await createService.mutateAsync(data);
    toast.success('Servicio creado');
  } catch (error) {
    if (error instanceof TRPCClientError) {
      if (error.data?.code === 'UNAUTHORIZED') {
        router.push('/login');
      } else if (error.data?.code === 'FORBIDDEN') {
        toast.error('No tienes permiso para esta acción');
      } else {
        toast.error(error.message);
      }
    }
  }
};
```

## Optimistic Updates

```mermaid
sequenceDiagram
    participant U as UI
    participant C as Cache
    participant S as Server

    U->>C: Update optimista
    C-->>U: UI actualizada inmediatamente
    U->>S: Mutation

    alt Success
        S-->>C: Confirmar update
    else Error
        S-->>C: Rollback
        C-->>U: Restaurar estado anterior
    end
```

```typescript
const updateService = trpc.service.update.useMutation({
  onMutate: async (newData) => {
    // Cancelar queries en progreso
    await utils.service.getById.cancel({ id: newData.id });

    // Guardar estado anterior
    const previousData = utils.service.getById.getData({ id: newData.id });

    // Update optimista
    utils.service.getById.setData({ id: newData.id }, (old) => ({
      ...old!,
      ...newData,
    }));

    return { previousData };
  },
  onError: (err, newData, context) => {
    // Rollback en caso de error
    utils.service.getById.setData(
      { id: newData.id },
      context?.previousData
    );
  },
  onSettled: () => {
    // Refrescar datos del servidor
    utils.service.getAll.invalidate();
  },
});
```
