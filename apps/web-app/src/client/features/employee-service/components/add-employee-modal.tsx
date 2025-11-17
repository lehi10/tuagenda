"use client";

import { useState } from "react";
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

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (employeeIds: string[]) => void;
  excludeEmployeeIds: string[];
}

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
}

export function AddEmployeeModal({
  open,
  onOpenChange,
  onAdd,
  excludeEmployeeIds,
}: AddEmployeeModalProps) {
  const { currentBusiness } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<Set<string>>(
    new Set()
  );

  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: employeesData, isLoading } =
    useTrpc.businessUser.getWithDetails.useQuery(
      {
        businessId: currentBusiness?.id || "",
        search: debouncedSearch || undefined,
      },
      {
        enabled: !!currentBusiness?.id && open,
      }
    );

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

  const handleAdd = () => {
    onAdd(Array.from(selectedEmployeeIds));
    setSelectedEmployeeIds(new Set());
    setSearchTerm("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setSelectedEmployeeIds(new Set());
    setSearchTerm("");
    onOpenChange(false);
  };

  // Filter employees: exclude already assigned and match search
  const availableEmployees = employeesData?.filter(
    (employee) => !excludeEmployeeIds.includes(employee.id)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar Empleados</DialogTitle>
          <DialogDescription>
            Selecciona los empleados que pueden ofrecer este servicio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
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
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : !availableEmployees || availableEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? "No se encontraron empleados"
                  : "No hay empleados disponibles"}
              </div>
            ) : (
              availableEmployees.map((employee) => (
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
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {employee.user.firstName} {employee.user.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {employee.user.email}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {employee.role}
                  </Badge>
                </label>
              ))
            )}
          </div>

          {/* Selection summary */}
          {selectedEmployeeIds.size > 0 && (
            <Badge variant="secondary">
              {selectedEmployeeIds.size} empleado
              {selectedEmployeeIds.size !== 1 ? "s" : ""} seleccionado
              {selectedEmployeeIds.size !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleAdd} disabled={selectedEmployeeIds.size === 0}>
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
