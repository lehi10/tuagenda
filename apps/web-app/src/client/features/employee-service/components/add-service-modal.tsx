"use client";

import { useState } from "react";
import { Search, Clock, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Checkbox } from "@/client/components/ui/checkbox";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/client/components/ui/dialog";
import { useBusiness } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";
import { useDebounce } from "@/client/hooks/use-debounce";

interface AddServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (serviceIds: string[]) => void;
  excludeServiceIds: string[];
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(price);
}

export function AddServiceModal({
  open,
  onOpenChange,
  onAdd,
  excludeServiceIds,
}: AddServiceModalProps) {
  const { currentBusiness } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: servicesData, isLoading } = useTrpc.service.list.useQuery(
    {
      active: true,
    },
    {
      enabled: !!currentBusiness?.id && open,
    }
  );

  const handleToggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  };

  const handleAdd = () => {
    onAdd(Array.from(selectedServiceIds));
    setSelectedServiceIds(new Set());
    setSearchTerm("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedServiceIds(new Set());
    setSearchTerm("");
    onOpenChange(false);
  };

  // Filter services: exclude already assigned and match search
  const availableServices = servicesData?.services
    .filter((service) => service.id && !excludeServiceIds.includes(service.id))
    .filter(
      (service) =>
        service.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        service.description
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Servicios</DialogTitle>
          <DialogDescription>
            Selecciona los servicios que deseas asignar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Services list */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !availableServices || availableServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No se encontraron servicios"
                  : "No hay servicios disponibles"}
              </div>
            ) : (
              availableServices.map((service) => (
                <label
                  key={service.id}
                  className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedServiceIds.has(service.id!)}
                    onCheckedChange={() => handleToggleService(service.id!)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{service.name}</div>
                    {service.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{formatPrice(service.price)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(service.durationMinutes)}</span>
                      </div>
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>

          {/* Selection summary */}
          {selectedServiceIds.size > 0 && (
            <Badge variant="secondary">
              {selectedServiceIds.size} servicio
              {selectedServiceIds.size !== 1 ? "s" : ""} seleccionado
              {selectedServiceIds.size !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={selectedServiceIds.size === 0}>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
