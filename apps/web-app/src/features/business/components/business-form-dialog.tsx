"use client";

import { useState } from "react";
import { useTranslation } from "@/i18n";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Business } from "db";
interface BusinessFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business?: Business | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function BusinessFormDialog({
  open,
  onOpenChange,
  business,
  onClose,
  onSuccess,
}: BusinessFormDialogProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: business?.title || "",
    slug: business?.slug || "",
    description: business?.description || "",
    email: business?.email || "",
    phone: business?.phone || "",
    website: business?.website || "",
    address: business?.address || "",
    city: business?.city || "",
    state: business?.state || "",
    country: business?.country || "",
    postalCode: business?.postalCode || "",
    timeZone: business?.timeZone || "America/New_York",
    locale: business?.locale || "en",
    currency: business?.currency || "USD",
    status: business?.status || "active",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-generate slug from title
    if (field === "title" && !business) {
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = business ? `/api/business/${business.id}` : "/api/business";
      const method = business ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save business");
      }

      const successMessage = business
        ? "Negocio actualizado exitosamente"
        : "Negocio creado exitosamente";

      toast.success(successMessage);
      onOpenChange(false);
      if (onClose) onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving business:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar el negocio"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {business
                ? t.pages.business.editBusiness
                : t.pages.business.addBusiness}
            </DialogTitle>
            <DialogDescription>
              {business
                ? "Actualiza la información de tu negocio"
                : "Completa la información para crear un nuevo negocio"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                {t.pages.business.form.basicInfo}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">{t.pages.business.form.title} *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">{t.pages.business.form.slug} *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    required
                    disabled={!!business}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t.pages.business.form.description}
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                {t.pages.business.form.contactInfo}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">{t.pages.business.form.email} *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.pages.business.form.phone} *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">{t.pages.business.form.website}</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                />
              </div>
            </div>

            <Separator />

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                {t.pages.business.form.locationInfo}
              </h3>
              <div className="space-y-2">
                <Label htmlFor="address">
                  {t.pages.business.form.address} *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">{t.pages.business.form.city} *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{t.pages.business.form.state}</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="country">
                    {t.pages.business.form.country} *
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">
                    {t.pages.business.form.postalCode}
                  </Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleChange("postalCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Regional Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">
                {t.pages.business.form.regionalSettings}
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="timeZone">
                    {t.pages.business.form.timeZone}
                  </Label>
                  <Select
                    value={formData.timeZone}
                    onValueChange={(value) => handleChange("timeZone", value)}
                  >
                    <SelectTrigger id="timeZone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        EST (New York)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        CST (Chicago)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        MST (Denver)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        PST (Los Angeles)
                      </SelectItem>
                      <SelectItem value="Europe/Madrid">
                        CET (Madrid)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        GMT (London)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locale">{t.pages.business.form.locale}</Label>
                  <Select
                    value={formData.locale}
                    onValueChange={(value) => handleChange("locale", value)}
                  >
                    <SelectTrigger id="locale">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">
                    {t.pages.business.form.currency}
                  </Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="MXN">MXN ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t.pages.business.form.status}</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    handleChange("status", value as any)
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      {t.pages.business.status.active}
                    </SelectItem>
                    <SelectItem value="inactive">
                      {t.pages.business.status.inactive}
                    </SelectItem>
                    <SelectItem value="suspended">
                      {t.pages.business.status.suspended}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                if (onClose) onClose();
              }}
              disabled={isLoading}
            >
              {t.pages.business.actions.cancel}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : t.pages.business.actions.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
