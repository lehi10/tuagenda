"use client";

import { ServicesManager } from "@/client/features/services/components/services-manager";

export default function ServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Servicios</h1>
        <p className="text-sm text-muted-foreground">
          Gestiona tu catalogo de servicios por categoria
        </p>
      </div>
      <ServicesManager />
    </div>
  );
}
