"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import { Label } from "@/client/components/ui/label";
import { Switch } from "@/client/components/ui/switch";
import { Badge } from "@/client/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/client/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { useBusiness } from "@/client/contexts";
import { useTrpc } from "@/client/lib/trpc";
import { AddEmployeeModal } from "@/client/features/employee-service/components/add-employee-modal";
import type { ServiceData, ServiceFormData } from "../types";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: ServiceData | null;
  categoryName: string;
  onSubmit: (data: ServiceFormData) => Promise<void>;
  isSubmitting?: boolean;
}

function getInitials(firstName: string, lastName: string | null): string {
  const first = firstName[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
}

export function ServiceFormModal({
  open,
  onOpenChange,
  service,
  categoryName,
  onSubmit,
  isSubmitting,
}: ServiceFormModalProps) {
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [active, setActive] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("info");
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

  const isEditing = !!service;

  // Fetch service's employees (only in edit mode)
  const { data: serviceEmployeesData, isLoading: loadingEmployees } =
    useTrpc.employeeService.getByService.useQuery(
      { serviceId: service?.id || "" },
      { enabled: !!service?.id && open }
    );

  // Mutations for employees
  const assignMutation = useTrpc.employeeService.assign.useMutation({
    onSuccess: () => {
      utils.employeeService.getByService.invalidate({
        serviceId: service?.id,
      });
      utils.employeeService.getByEmployee.invalidate();
    },
  });

  const unassignMutation = useTrpc.employeeService.unassign.useMutation({
    onSuccess: () => {
      utils.employeeService.getByService.invalidate({
        serviceId: service?.id,
      });
      utils.employeeService.getByEmployee.invalidate();
    },
  });

  useEffect(() => {
    if (open) {
      if (service) {
        setName(service.name);
        setDescription(service.description || "");
        setPrice(service.price.toString());
        const h = Math.floor(service.durationMinutes / 60);
        const m = service.durationMinutes % 60;
        setHours(h > 0 ? h.toString() : "");
        setMinutes(m > 0 ? m.toString() : "");
        setActive(service.active);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setHours("");
        setMinutes("30");
        setActive(true);
      }
      setError("");
      setActiveTab("info");
    }
  }, [open, service]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      setError("El precio debe ser un numero valido");
      return;
    }

    const hoursNum = hours ? parseInt(hours, 10) : 0;
    const minutesNum = minutes ? parseInt(minutes, 10) : 0;
    const totalMinutes = hoursNum * 60 + minutesNum;

    if (hoursNum === 0 && minutesNum === 0) {
      setError("La duracion debe ser mayor a 0");
      return;
    }

    if (totalMinutes > 1440) {
      setError("La duracion no puede exceder 24 horas");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        price: priceNum,
        durationMinutes: totalMinutes,
        active,
      });
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al guardar el servicio");
      }
    }
  };

  const handleAddEmployees = async (employeeIds: string[]) => {
    if (!service?.id || !currentBusiness?.id) return;

    try {
      for (const businessUserId of employeeIds) {
        await assignMutation.mutateAsync({
          businessUserId,
          serviceId: service.id,
          businessId: currentBusiness.id,
        });
      }
      toast.success(
        `${employeeIds.length} empleado${employeeIds.length !== 1 ? "s" : ""} agregado${employeeIds.length !== 1 ? "s" : ""}`
      );
    } catch (_error) {
      toast.error("Error al agregar empleados");
    }
  };

  const handleRemoveEmployee = async (businessUserId: string) => {
    if (!service?.id) return;

    try {
      await unassignMutation.mutateAsync({
        businessUserId,
        serviceId: service.id,
      });
      toast.success("Empleado eliminado");
    } catch (_error) {
      toast.error("Error al eliminar empleado");
    }
  };

  const assignedEmployeeIds =
    serviceEmployeesData?.employees.map((e) => e.id) || [];

  const renderServiceForm = () => (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="service-name">Nombre *</Label>
        <Input
          id="service-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Corte clasico"
          maxLength={255}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-description">Descripcion</Label>
        <Textarea
          id="service-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripcion opcional del servicio"
          rows={3}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-price">Precio *</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="service-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="pl-7"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Duracion *</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="0"
                disabled={isSubmitting}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                horas
              </span>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="30"
                disabled={isSubmitting}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                min
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>Estado</Label>
          <p className="text-xs text-muted-foreground">
            Los servicios inactivos no se muestran a clientes
          </p>
        </div>
        <Switch
          checked={active}
          onCheckedChange={setActive}
          disabled={isSubmitting}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-[500px] p-0 flex flex-col">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="text-xl">
              {isEditing ? "Editar Servicio" : "Nuevo Servicio"}
            </SheetTitle>
            <SheetDescription>
              Categoria: <span className="font-medium">{categoryName}</span>
            </SheetDescription>
          </SheetHeader>

          {isEditing ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="mx-6 mt-4 grid w-auto grid-cols-2">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="employees">Empleados</TabsTrigger>
              </TabsList>

              <TabsContent
                value="info"
                className="flex-1 flex flex-col overflow-hidden mt-0"
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {renderServiceForm()}

                  <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => onOpenChange(false)}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      {isSubmitting ? "Guardando..." : "Guardar"}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent
                value="employees"
                className="flex-1 flex flex-col overflow-hidden mt-0"
              >
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Empleados Asignados</h3>
                    <Button
                      size="sm"
                      onClick={() => setAddEmployeeModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>

                  {loadingEmployees ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : !serviceEmployeesData?.employees.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay empleados asignados
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {serviceEmployeesData.employees.map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center gap-3 p-3 rounded-lg border group"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={employee.user.avatarUrl || undefined}
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
                            {employee.displayName || "Employee"}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveEmployee(employee.id)}
                            disabled={unassignMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cerrar
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              {renderServiceForm()}

              <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Guardando..." : "Crear"}
                </Button>
              </div>
            </form>
          )}
        </SheetContent>
      </Sheet>

      {isEditing && (
        <AddEmployeeModal
          open={addEmployeeModalOpen}
          onOpenChange={setAddEmployeeModalOpen}
          onAdd={handleAddEmployees}
          excludeEmployeeIds={assignedEmployeeIds}
        />
      )}
    </>
  );
}
