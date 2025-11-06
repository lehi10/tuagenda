"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Globe,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/i18n";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { BusinessFormDialog } from "./business-form-dialog";
import { toast } from "sonner";
import { BusinessProps } from "@/core/domain/entities/Business";
import { listBusinesses, deleteBusiness } from "@/actions/business";
import { useBusiness } from "@/contexts";

export const BusinessList = forwardRef<{ refresh: () => void }>(
  (props, ref) => {
    const { t } = useTranslation();
    const { refreshBusinesses } = useBusiness();
    const [editingBusiness, setEditingBusiness] =
      useState<BusinessProps | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [businesses, setBusinesses] = useState<BusinessProps[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refresh: fetchBusinesses,
    }));

    // Fetch businesses on mount
    useEffect(() => {
      fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
      try {
        setIsLoading(true);
        const result = await listBusinesses();

        if (result.success) {
          setBusinesses(result.businesses);
          // Refresh business switcher in case names changed
          await refreshBusinesses();
        } else {
          toast.error(result.error || "Error al cargar los negocios");
        }
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast.error("Error al cargar los negocios");
      } finally {
        setIsLoading(false);
      }
    };

    const handleEdit = (business: BusinessProps) => {
      setEditingBusiness(business);
      setIsEditDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
      if (!confirm(t.pages.business.actions.confirmDelete)) {
        return;
      }

      try {
        const result = await deleteBusiness(id);

        if (result.success) {
          toast.success("Negocio eliminado exitosamente");
          fetchBusinesses(); // Refresh the list
          await refreshBusinesses(); // Refresh business switcher
        } else {
          toast.error(result.error || "Error al eliminar el negocio");
        }
      } catch (error) {
        console.error("Error deleting business:", error);
        toast.error("Error al eliminar el negocio");
      }
    };

    const getStatusVariant = (
      status: string
    ): "default" | "secondary" | "destructive" => {
      switch (status) {
        case "active":
          return "default";
        case "inactive":
          return "secondary";
        case "suspended":
          return "destructive";
        default:
          return "secondary";
      }
    };

    if (isLoading) {
      return (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      );
    }

    if (businesses.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-medium text-muted-foreground">
              {t.pages.business.noBusiness}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.pages.business.createFirst}
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card
              key={business.id}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20"
            >
              <CardHeader className="pb-4 space-y-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12 shrink-0 ring-2 ring-primary/10">
                    <AvatarImage
                      src={business.logo || undefined}
                      alt={business.title}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20">
                      <Building2 className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold truncate group-hover:text-primary transition-colors">
                          {business.title}
                        </CardTitle>
                        <CardDescription className="text-xs mt-0.5">
                          /{business.slug}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(business)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            {t.common.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() =>
                              business.id && handleDelete(business.id)
                            }
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t.common.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="mt-2">
                      <Badge
                        variant={getStatusVariant(business.status || "active")}
                        className="text-xs"
                      >
                        {business.status &&
                          t.pages.business.status[business.status]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {business.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description}
                  </p>
                )}

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{business.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">
                      {business.city}, {business.country}
                    </span>
                  </div>
                  {business.website && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{business.website}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingBusiness && (
          <BusinessFormDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            business={editingBusiness}
            onClose={() => {
              setEditingBusiness(null);
              setIsEditDialogOpen(false);
            }}
            onSuccess={() => {
              fetchBusinesses(); // Refresh the list after edit
            }}
          />
        )}
      </>
    );
  }
);

BusinessList.displayName = "BusinessList";
