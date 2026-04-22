"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Checkbox } from "@/client/components/ui/checkbox";
import { Input } from "@/client/components/ui/input";
import { Badge } from "@/client/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
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

interface ServiceEmployeesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  serviceId: string;
  serviceName: string;
}

export function ServiceEmployeesSheet({
  open,
  onOpenChange,
  serviceId,
  serviceName,
}: ServiceEmployeesSheetProps) {
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(
    new Set()
  );
  const [initialEmployeeIds, setInitialEmployeeIds] = useState<Set<string>>(
    new Set()
  );
  const [isSaving, setIsSaving] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch all employees for the business
  const { data: employeesData, isLoading: isLoadingEmployees } =
    useTrpc.businessUser.getWithDetails.useQuery(
      {},
      {
        enabled: !!currentBusiness?.id && open,
      }
    );

  // Fetch current service's employees
  const { data: serviceEmployeesData, isLoading: isLoadingServiceEmployees } =
    useTrpc.employeeService.getByService.useQuery(
      {
        serviceId: serviceId,
      },
      {
        enabled: !!serviceId && open,
      }
    );

  // Mutations for assigning/unassigning
  const assignMutation = useTrpc.employeeService.assign.useMutation();
  const unassignMutation = useTrpc.employeeService.unassign.useMutation();

  // Initialize selected employees when data loads
  useEffect(() => {
    if (serviceEmployeesData && open) {
      const employeeIds = new Set(
        serviceEmployeesData.employees.map((e) => e.id)
      );
      setSelectedEmployeeIds(employeeIds);
      setInitialEmployeeIds(employeeIds);
    }
  }, [serviceEmployeesData, open]);

  // Reset state when sheet closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
      setSelectedEmployeeIds(new Set());
      setInitialEmployeeIds(new Set());
      setIsSaving(false);
    }
  }, [open]);

  const handleToggleEmployee = (employeeId: string) => {
    setSelectedEmployeeIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(employeeId)) {
        newSet.delete(employeeId);
      } else {
        newSet.add(employeeId);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!currentBusiness?.id) return;

    setIsSaving(true);

    try {
      // Calculate what changed
      const toAssign = Array.from(selectedEmployeeIds).filter(
        (id) => !initialEmployeeIds.has(id)
      );
      const toUnassign = Array.from(initialEmployeeIds).filter(
        (id) => !selectedEmployeeIds.has(id)
      );

      // Execute all mutations
      const promises: Promise<unknown>[] = [];

      for (const employeeId of toAssign) {
        promises.push(
          assignMutation.mutateAsync({
            businessUserId: employeeId,
            serviceId: serviceId,
          })
        );
      }

      for (const employeeId of toUnassign) {
        promises.push(
          unassignMutation.mutateAsync({
            businessUserId: employeeId,
            serviceId: serviceId,
          })
        );
      }

      await Promise.all(promises);

      // Invalidate queries
      utils.employeeService.getByService.invalidate({ serviceId });
      utils.employeeService.getByEmployee.invalidate();

      toast.success("Empleados actualizados correctamente");
      onOpenChange(false);
    } catch (error) {
      toast.error(
        `Error al actualizar empleados: ${error instanceof Error ? error.message : "Error desconocido"}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = () => {
    if (selectedEmployeeIds.size !== initialEmployeeIds.size) return true;
    for (const id of selectedEmployeeIds) {
      if (!initialEmployeeIds.has(id)) return true;
    }
    return false;
  };

  const getInitials = (firstName: string, lastName: string | null) => {
    const first = firstName[0] || "";
    const last = lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  // Filter employees by search term
  const filteredEmployees = employeesData?.filter((employee) => {
    const fullName =
      `${employee.user.firstName} ${employee.user.lastName || ""}`.toLowerCase();
    const email = employee.user.email.toLowerCase();
    const search = debouncedSearch.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  const isLoading = isLoadingEmployees || isLoadingServiceEmployees;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Gestionar Empleados</SheetTitle>
          <SheetDescription>
            Selecciona los empleados que pueden ofrecer{" "}
            <span className="font-medium">{serviceName}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empleados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Employees list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !filteredEmployees || filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No se encontraron empleados"
                  : "No hay empleados disponibles"}
              </div>
            ) : (
              filteredEmployees.map((employee) => (
                <label
                  key={employee.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <Checkbox
                    checked={selectedEmployeeIds.has(employee.id)}
                    onCheckedChange={() => handleToggleEmployee(employee.id)}
                  />
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={employee.user.pictureFullPath || undefined}
                    />
                    <AvatarFallback>
                      {getInitials(
                        employee.user.firstName,
                        employee.user.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">
                      {employee.user.firstName} {employee.user.lastName || ""}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {employee.user.email}
                    </div>
                  </div>
                  <Badge
                    variant={
                      employee.role === "MANAGER" ? "default" : "secondary"
                    }
                  >
                    {employee.role}
                  </Badge>
                </label>
              ))
            )}
          </div>

          {/* Selection summary */}
          {selectedEmployeeIds.size > 0 && (
            <div className="border-t pt-3">
              <Badge variant="secondary">
                {selectedEmployeeIds.size} empleado
                {selectedEmployeeIds.size !== 1 ? "s" : ""} seleccionado
                {selectedEmployeeIds.size !== 1 ? "s" : ""}
              </Badge>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges() || isSaving || !currentBusiness?.id}
          >
            {isSaving ? (
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
