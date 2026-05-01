"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Search,
  Plus,
  Trash2,
  Clock,
  DollarSign,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { useTrpc } from "@/client/lib/trpc";
import { useBusiness } from "@/client/contexts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/client/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/client/components/ui/form";
import { Input } from "@/client/components/ui/input";
import { Button } from "@/client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import { BusinessRole } from "@/server/core/domain/entities";
import { useDebounce } from "@/client/hooks/use-debounce";
import { AddServiceModal } from "@/client/features/employee-service/components/add-service-modal";
import {
  AvailabilityManager,
  ExceptionManager,
  WeeklyScheduleDialog,
} from "@/client/features/employee-availability/components";

const formSchema = z.object({
  userId: z.string().min(1, "User is required"),
  role: z.enum(BusinessRole),
});

type FormValues = z.infer<typeof formSchema>;

interface EmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: FormValues) => Promise<void>;
  editData?: {
    id: string;
    userId: string;
    role: BusinessRole;
    firstName: string;
    lastName: string;
  };
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

export function EmployeeDialog({
  open,
  onOpenChange,
  onSubmit,
  editData,
}: EmployeeDialogProps) {
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [scheduleCalendarOpen, setScheduleCalendarOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: editData?.userId || "",
      role: editData?.role || BusinessRole.EMPLOYEE,
    },
  });

  const { data: searchData, isLoading: searching } =
    useTrpc.user.search.useQuery(
      { search: debouncedSearch },
      { enabled: !editData && debouncedSearch.length >= 2 }
    );
  const searchResults = searchData?.users;

  // Fetch employee's services (only in edit mode)
  const { data: employeeServicesData, isLoading: loadingServices } =
    useTrpc.employeeService.getByEmployee.useQuery(
      { businessUserId: editData?.id || "" },
      { enabled: !!editData?.id && open }
    );

  // Mutations for services
  const assignMutation = useTrpc.employeeService.assign.useMutation({
    onSuccess: () => {
      utils.employeeService.getByEmployee.invalidate({
        businessUserId: editData?.id,
      });
      utils.employeeService.getByService.invalidate();
    },
  });

  const unassignMutation = useTrpc.employeeService.unassign.useMutation({
    onSuccess: () => {
      utils.employeeService.getByEmployee.invalidate({
        businessUserId: editData?.id,
      });
      utils.employeeService.getByService.invalidate();
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        userId: editData.userId,
        role: editData.role,
      });
    }
  }, [editData, form]);

  useEffect(() => {
    if (!open) {
      setActiveTab("info");
      setSearchTerm("");
    }
  }, [open]);

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(values);
      form.reset();
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save employee:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddServices = async (serviceIds: string[]) => {
    if (!editData?.id || !currentBusiness?.id) return;

    try {
      for (const serviceId of serviceIds) {
        await assignMutation.mutateAsync({
          businessUserId: editData.id,
          serviceId,
        });
      }
      toast.success(
        `${serviceIds.length} servicio${serviceIds.length !== 1 ? "s" : ""} agregado${serviceIds.length !== 1 ? "s" : ""}`
      );
    } catch (_error) {
      toast.error("Error al agregar servicios");
    }
  };

  const handleRemoveService = async (serviceId: string) => {
    if (!editData?.id) return;

    try {
      await unassignMutation.mutateAsync({
        businessUserId: editData.id,
        serviceId,
      });
      toast.success("Servicio eliminado");
    } catch (_error) {
      toast.error("Error al eliminar servicio");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const assignedServiceIds =
    employeeServicesData?.services.map((s) => s.id) || [];

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-[500px] p-0 flex flex-col">
          <SheetHeader className="px-4 py-4 sm:px-6 border-b">
            <SheetTitle className="text-xl">
              {editData ? "Editar Empleado" : "Agregar Empleado"}
            </SheetTitle>
            <SheetDescription>
              {editData
                ? "Actualiza la información y servicios del empleado"
                : "Busca un usuario y asígnale un rol"}
            </SheetDescription>
          </SheetHeader>

          {editData ? (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <TabsList className="mx-4 sm:mx-6 mt-4 grid w-auto grid-cols-3">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="services">Servicios</TabsTrigger>
                <TabsTrigger value="schedule">Horarios</TabsTrigger>
              </TabsList>

              <TabsContent
                value="info"
                className="flex-1 flex flex-col overflow-hidden mt-0"
              >
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col flex-1 overflow-hidden"
                  >
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm text-muted-foreground">
                          Editando:
                        </p>
                        <p className="text-sm font-medium">
                          {editData.firstName} {editData.lastName}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rol</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un rol" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value={BusinessRole.EMPLOYEE}>
                                  Empleado
                                </SelectItem>
                                <SelectItem value={BusinessRole.MANAGER}>
                                  Manager
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 px-4 sm:px-6 py-4 border-t bg-muted/30">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="flex-1"
                      >
                        {submitting && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Guardar
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent
                value="services"
                className="flex-1 flex flex-col overflow-hidden mt-0"
              >
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium">Servicios Asignados</h3>
                    <Button
                      size="sm"
                      onClick={() => setAddServiceModalOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>

                  {loadingServices ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : !employeeServicesData?.services.length ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No hay servicios asignados
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {employeeServicesData.services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-start gap-3 p-3 rounded-lg border group"
                        >
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveService(service.id)}
                            disabled={unassignMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 px-4 sm:px-6 py-4 border-t bg-muted/30">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="flex-1"
                  >
                    Cerrar
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="schedule"
                className="flex-1 flex flex-col overflow-hidden mt-0"
              >
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
                  {/* Calendar View Button */}
                  <div className="mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setScheduleCalendarOpen(true)}
                      className="w-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Ver Calendario Semanal
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Disponibilidad Semanal
                      </h3>
                      <AvailabilityManager businessUserId={editData.id} />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-sm font-medium mb-3">Excepciones</h3>
                      <ExceptionManager businessUserId={editData.id} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 px-4 sm:px-6 py-4 border-t bg-muted/30">
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col flex-1 overflow-hidden"
              >
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
                  <div className="space-y-2">
                    <FormLabel>Buscar Usuario</FormLabel>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por email o nombre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                      {searching && (
                        <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </div>
                    {searchResults && searchResults.length > 0 && (
                      <div className="border rounded-md max-h-[200px] overflow-y-auto">
                        {searchResults.map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => {
                              form.setValue("userId", user.id);
                              setSearchTerm(
                                `${user.firstName} ${user.lastName} (${user.email})`
                              );
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-accent transition-colors text-left"
                          >
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={user.pictureFullPath || undefined}
                              />
                              <AvatarFallback>
                                {getInitials(user.firstName, user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">
                                {user.firstName} {user.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rol</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un rol" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={BusinessRole.EMPLOYEE}>
                              Empleado
                            </SelectItem>
                            <SelectItem value={BusinessRole.MANAGER}>
                              Manager
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex gap-3 px-4 sm:px-6 py-4 border-t bg-muted/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset();
                      setSearchTerm("");
                      onOpenChange(false);
                    }}
                    disabled={submitting}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !form.watch("userId")}
                    className="flex-1"
                  >
                    {submitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Agregar
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </SheetContent>
      </Sheet>

      {editData && (
        <>
          <AddServiceModal
            open={addServiceModalOpen}
            onOpenChange={setAddServiceModalOpen}
            onAdd={handleAddServices}
            excludeServiceIds={assignedServiceIds}
          />
          <WeeklyScheduleDialog
            open={scheduleCalendarOpen}
            onOpenChange={setScheduleCalendarOpen}
            businessUserId={editData.id}
            employeeName={`${editData.firstName} ${editData.lastName}`}
          />
        </>
      )}
    </>
  );
}
