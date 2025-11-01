"use client";

import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
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
import { useTranslation } from "@/i18n";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { BusinessFormDialog } from "./business-form-dialog";
import { toast } from "sonner";
import { useOrganization } from "@/contexts/organization-context";
import { Business } from "db";

export const BusinessList = forwardRef<{ refresh: () => void }>(
  (props, ref) => {
    const { t } = useTranslation();
    const { refreshOrganizations } = useOrganization();
    const [editingBusiness, setEditingBusiness] = useState<Business | null>(
      null
    );
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [businesses, setBusinesses] = useState<Business[]>([]);
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
        const response = await fetch("/api/business");

        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }

        const data = await response.json();
        setBusinesses(data.businesses || data);
        // Refresh organization switcher in case names changed
        await refreshOrganizations();
      } catch (error) {
        console.error("Error fetching businesses:", error);
        toast.error("Error al cargar los negocios");
      } finally {
        setIsLoading(false);
      }
    };

    const handleEdit = (business: Business) => {
      setEditingBusiness(business);
      setIsEditDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
      if (!confirm(t.pages.business.actions.confirmDelete)) {
        return;
      }

      try {
        const response = await fetch(`/api/business/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete business");
        }

        toast.success("Negocio eliminado exitosamente");
        fetchBusinesses(); // Refresh the list
        await refreshOrganizations(); // Refresh organization switcher
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
            <Card key={business.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{business.title}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {business.slug}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(business)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t.common.edit}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(business.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t.common.delete}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {business.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {business.description}
                  </p>
                )}
                <div className="space-y-1 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <span className="font-medium min-w-[4rem]">Email:</span>
                    <span className="truncate">{business.email}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span className="font-medium min-w-[4rem]">Tel:</span>
                    <span>{business.phone}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <span className="font-medium min-w-[4rem]">Ciudad:</span>
                    <span>
                      {business.city}, {business.country}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <Badge variant={getStatusVariant(business.status)}>
                    {t.pages.business.status[business.status]}
                  </Badge>
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
