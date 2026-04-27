"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/client/components/ui/button";
import { useBusiness } from "@/client/contexts/business-context";
import { useTrpc } from "@/client/lib/trpc";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/client/components/ui/alert-dialog";
import { CategorySidebar } from "./category-sidebar";
import { ServiceCard } from "./service-card";
import { CategoryFormModal } from "./category-form-modal";
import { ServiceFormModal } from "./service-form-modal";
import type {
  ServiceCategoryData,
  ServiceData,
  CategoryFormData,
  ServiceFormData,
} from "../types";

export function ServicesManager() {
  const { currentBusiness } = useBusiness();
  const utils = useTrpc.useUtils();

  // State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategoryData | null>(null);
  const [editingService, setEditingService] = useState<ServiceData | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] =
    useState<ServiceCategoryData | null>(null);
  const [deletingService, setDeletingService] = useState<ServiceData | null>(
    null
  );

  // Queries
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useTrpc.serviceCategory.list.useQuery(
      {},
      { enabled: !!currentBusiness?.id }
    );

  const { data: servicesData, isLoading: isLoadingServices } =
    useTrpc.service.list.useQuery({}, { enabled: !!currentBusiness?.id });

  // Mutations
  const createCategoryMutation = useTrpc.serviceCategory.create.useMutation({
    onSuccess: () => {
      utils.serviceCategory.list.invalidate();
    },
  });

  const updateCategoryMutation = useTrpc.serviceCategory.update.useMutation({
    onSuccess: () => {
      utils.serviceCategory.list.invalidate();
    },
  });

  const deleteCategoryMutation = useTrpc.serviceCategory.delete.useMutation({
    onSuccess: () => {
      utils.serviceCategory.list.invalidate();
      utils.service.list.invalidate();
      if (deletingCategory?.id === selectedCategoryId) {
        setSelectedCategoryId(null);
      }
    },
  });

  const createServiceMutation = useTrpc.service.create.useMutation({
    onSuccess: () => {
      utils.service.list.invalidate();
    },
  });

  const updateServiceMutation = useTrpc.service.update.useMutation({
    onSuccess: () => {
      utils.service.list.invalidate();
    },
  });

  const deleteServiceMutation = useTrpc.service.delete.useMutation({
    onSuccess: () => {
      utils.service.list.invalidate();
    },
  });

  // Computed
  const categories = useMemo(
    () => (categoriesData?.categories || []) as ServiceCategoryData[],
    [categoriesData?.categories]
  );

  const services = useMemo(
    () => (servicesData?.services || []) as ServiceData[],
    [servicesData?.services]
  );

  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    services.forEach((service) => {
      if (service.categoryId) {
        counts[service.categoryId] = (counts[service.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [services]);

  const filteredServices = useMemo(() => {
    if (!selectedCategoryId) return [];
    return services.filter((s) => s.categoryId === selectedCategoryId);
  }, [services, selectedCategoryId]);

  const selectedCategory = useMemo(() => {
    return categories.find((c) => c.id === selectedCategoryId) || null;
  }, [categories, selectedCategoryId]);

  // Auto-select first category
  useEffect(() => {
    if (categories.length > 0 && !selectedCategoryId && !isLoadingCategories) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId, isLoadingCategories]);

  // Handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: ServiceCategoryData) => {
    setEditingCategory(category);
    setCategoryModalOpen(true);
  };

  const handleDeleteCategory = (category: ServiceCategoryData) => {
    setDeletingCategory(category);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    const categoryName = deletingCategory.name;
    await deleteCategoryMutation.mutateAsync({ id: deletingCategory.id });
    setDeletingCategory(null);
    toast.success(`Categoria "${categoryName}" eliminada`);
  };

  const handleCategorySubmit = async (data: CategoryFormData) => {
    if (!currentBusiness?.id) throw new Error("No hay negocio seleccionado");

    if (editingCategory) {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        name: data.name,
        description: data.description || null,
      });
      toast.success("Categoria actualizada correctamente");
    } else {
      const result = await createCategoryMutation.mutateAsync({
        name: data.name,
        description: data.description || null,
      });
      setSelectedCategoryId(result.id || null);
      toast.success("Categoria creada correctamente");
    }
  };

  const handleAddService = () => {
    setEditingService(null);
    setServiceModalOpen(true);
  };

  const handleEditService = (service: ServiceData) => {
    setEditingService(service);
    setServiceModalOpen(true);
  };

  const handleDeleteService = (service: ServiceData) => {
    setDeletingService(service);
  };

  const handleConfirmDeleteService = async () => {
    if (!deletingService) return;
    const serviceName = deletingService.name;
    await deleteServiceMutation.mutateAsync({ id: deletingService.id });
    setDeletingService(null);
    toast.success(`Servicio "${serviceName}" eliminado`);
  };

  const handleServiceSubmit = async (data: ServiceFormData) => {
    if (!currentBusiness?.id) throw new Error("No hay negocio seleccionado");
    if (!selectedCategoryId) throw new Error("No hay categoria seleccionada");

    if (editingService) {
      await updateServiceMutation.mutateAsync({
        id: editingService.id,
        name: data.name,
        description: data.description || null,
        price: data.price,
        durationMinutes: data.durationMinutes,
        active: data.active,
        isVirtual: data.isVirtual,
        requiresOnlinePayment: data.requiresOnlinePayment,
      });
      toast.success("Servicio actualizado correctamente");
    } else {
      await createServiceMutation.mutateAsync({
        categoryId: selectedCategoryId,
        name: data.name,
        description: data.description || null,
        price: data.price,
        durationMinutes: data.durationMinutes,
        active: data.active,
        isVirtual: data.isVirtual,
        requiresOnlinePayment: data.requiresOnlinePayment,
      });
      toast.success("Servicio creado correctamente");
    }
  };

  const handleToggleActive = async (service: ServiceData, active: boolean) => {
    await updateServiceMutation.mutateAsync({
      id: service.id,
      active,
    });
    toast.success(
      active
        ? `Servicio "${service.name}" activado`
        : `Servicio "${service.name}" desactivado`
    );
  };

  // Loading state
  if (!currentBusiness) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando negocio...</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] border rounded-lg overflow-hidden bg-background">
      <CategorySidebar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        serviceCounts={serviceCounts}
        onSelectCategory={setSelectedCategoryId}
        onAddCategory={handleAddCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDeleteCategory}
        isLoading={isLoadingCategories}
      />

      <div className="flex-1 flex flex-col">
        {categories.length === 0 && !isLoadingCategories ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">
                  Crea tu primera categoria
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Organiza tus servicios en categorias para una mejor gestion
                </p>
              </div>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Categoria
              </Button>
            </div>
          </div>
        ) : selectedCategory ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.description && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory.description}
                  </p>
                )}
              </div>
              <Button onClick={handleAddService}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Servicio
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {isLoadingServices ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-48 bg-muted animate-pulse rounded-lg"
                    />
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-3">
                    <p className="text-muted-foreground">
                      No hay servicios en esta categoria
                    </p>
                    <Button variant="outline" onClick={handleAddService}>
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar primer servicio
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onToggleActive={handleToggleActive}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">
              Selecciona una categoria para ver sus servicios
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryFormModal
        open={categoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        category={editingCategory}
        onSubmit={handleCategorySubmit}
        isSubmitting={
          createCategoryMutation.isPending || updateCategoryMutation.isPending
        }
      />

      <ServiceFormModal
        open={serviceModalOpen}
        onOpenChange={setServiceModalOpen}
        service={editingService}
        categoryName={selectedCategory?.name || ""}
        onSubmit={handleServiceSubmit}
        isSubmitting={
          createServiceMutation.isPending || updateServiceMutation.isPending
        }
      />

      {/* Delete Category Confirmation */}
      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={() => setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de eliminar la categoria &quot;
              {deletingCategory?.name}
              &quot;? Los servicios asociados quedaran sin categoria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteCategory}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCategoryMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Service Confirmation */}
      <AlertDialog
        open={!!deletingService}
        onOpenChange={() => setDeletingService(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Servicio</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estas seguro de eliminar el servicio &quot;
              {deletingService?.name}
              &quot;? Esta accion no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteService}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteServiceMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
