"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { useState } from "react";
import { BusinessFormDialog } from "./business-form-dialog";

interface Business {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: "active" | "inactive" | "suspended";
}

export function BusinessList() {
  const { t } = useTranslation();
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock data - replace with actual API call
  const businesses: Business[] = [
    {
      id: 1,
      title: "Barbería El Corte",
      slug: "barberia-el-corte",
      description: "La mejor barbería de la ciudad",
      email: "contacto@elcorte.com",
      phone: "+1 555-1234",
      address: "Calle Principal 123",
      city: "Madrid",
      country: "España",
      status: "active",
    },
    {
      id: 2,
      title: "Salón Bella",
      slug: "salon-bella",
      description: "Salón de belleza profesional",
      email: "info@salonbella.com",
      phone: "+1 555-5678",
      address: "Avenida Central 456",
      city: "Barcelona",
      country: "España",
      status: "active",
    },
  ];

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm(t.pages.business.actions.confirmDelete)) {
      // TODO: Implement delete API call
      console.log("Deleting business:", id);
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
                  <span>{business.city}, {business.country}</span>
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
        />
      )}
    </>
  );
}
