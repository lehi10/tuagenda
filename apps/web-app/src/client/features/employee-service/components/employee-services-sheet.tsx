"use client";

import { useState, useEffect } from "react";
import { Search, Clock, DollarSign, Loader2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Checkbox } from "@/client/components/ui/checkbox";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/client/components/ui/sheet";
import { toast } from "sonner";
import { useBusiness } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";
import { useDebounce } from "@/client/hooks/use-debounce";

interface EmployeeServicesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeeId: string;
  employeeName: string;
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

export function EmployeeServicesSheet({
  open,
  onOpenChange,
  employeeId,
  employeeName,
}: EmployeeServicesSheetProps) {
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(
    new Set()
  );
  const [initialServiceIds, setInitialServiceIds] = useState<Set<string>>(
    new Set()
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch all services for the business
  const { data: servicesData, isLoading: isLoadingServices } =
    useTrpc.service.list.useQuery(
      {
        businessId: currentBusiness?.id || "",
        active: true,
      },
      {
        enabled: !!currentBusiness?.id && open,
      }
    );

  // Fetch current employee's services
  const { data: employeeServicesData, isLoading: isLoadingEmployeeServices } =
    useTrpc.employeeService.getByEmployee.useQuery(
      {
        businessUserId: employeeId,
      },
      {
        enabled: !!employeeId && open,
      }
    );

  // Mutation for assigning multiple services
  const assignMultipleMutation =
    useTrpc.employeeService.assignMultiple.useMutation({
      onSuccess: () => {
        utils.employeeService.getByEmployee.invalidate({
          businessUserId: employeeId,
        });
        utils.employeeService.getByService.invalidate();
        toast.success("Servicios actualizados correctamente");
        onOpenChange(false);
      },
      onError: (error) => {
        toast.error(`Error al actualizar servicios: ${error.message}`);
      },
    });

  // Initialize selected services when data loads
  useEffect(() => {
    if (employeeServicesData && open) {
      const serviceIds = new Set(
        employeeServicesData.services.map((s) => s.id)
      );
      setSelectedServiceIds(serviceIds);
      setInitialServiceIds(serviceIds);
    }
  }, [employeeServicesData, open]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedServiceIds(new Set());
      setInitialServiceIds(new Set());
    }
  }, [open]);

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

  const handleSave = async () => {
    if (!currentBusiness?.id) return;

    await assignMultipleMutation.mutateAsync({
      businessUserId: employeeId,
      serviceIds: Array.from(selectedServiceIds),
      businessId: currentBusiness.id,
    });
  };

  const hasChanges = () => {
    if (selectedServiceIds.size !== initialServiceIds.size) return true;
    for (const id of selectedServiceIds) {
      if (!initialServiceIds.has(id)) return true;
    }
    return false;
  };

  // Filter services by search term
  const filteredServices = servicesData?.services
    .filter((service) => service.id) // Only services with id
    .filter(
      (service) =>
        service.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        service.description
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase())
    );

  // Group services by category (null category = "Sin categoría")
  const groupedServices = filteredServices?.reduce(
    (acc, service) => {
      const categoryId = service.categoryId || "uncategorized";
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(service);
      return acc;
    },
    {} as Record<string, typeof filteredServices>
  );

  const isLoading = isLoadingServices || isLoadingEmployeeServices;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Gestionar Servicios</SheetTitle>
          <SheetDescription>
            Selecciona los servicios que puede ofrecer{" "}
            <span className="font-medium">{employeeName}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
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
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !filteredServices || filteredServices.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No se encontraron servicios"
                  : "No hay servicios disponibles"}
              </div>
            ) : (
              Object.entries(groupedServices || {}).map(
                ([categoryId, services]) => (
                  <div key={categoryId} className="space-y-2">
                    {categoryId !== "uncategorized" && (
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Categoría
                      </h4>
                    )}
                    {services?.map((service) => (
                      <label
                        key={service.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={selectedServiceIds.has(service.id!)}
                          onCheckedChange={() =>
                            handleToggleService(service.id!)
                          }
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
                              <span>
                                {formatDuration(service.durationMinutes)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )
              )
            )}
          </div>

          {/* Selection summary */}
          {selectedServiceIds.size > 0 && (
            <div className="border-t pt-3">
              <Badge variant="secondary">
                {selectedServiceIds.size} servicio
                {selectedServiceIds.size !== 1 ? "s" : ""} seleccionado
                {selectedServiceIds.size !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={assignMultipleMutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !hasChanges() ||
              assignMultipleMutation.isPending ||
              !currentBusiness?.id
            }
          >
            {assignMultipleMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
