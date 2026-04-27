"use client";

import { useState, useRef } from "react";
import { useTranslation } from "@/client/i18n";
import { toast } from "sonner";
import { Camera, Loader2, Building2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/client/components/ui/sheet";
import { Button } from "@/client/components/ui/button";
import { Input } from "@/client/components/ui/input";
import { Label } from "@/client/components/ui/label";
import { Textarea } from "@/client/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Separator } from "@/client/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { BusinessProps } from "@/server/core/domain/entities/Business";
import { useTrpc } from "@/client/lib/trpc";
import { useImageUpload } from "@/client/hooks/use-image-upload";
import { STORAGE_PATHS } from "@/shared/constants/image.constants";
import { logger } from "@/shared/lib/logger";
import {
  getBrowserTimezone,
  SUPPORTED_TIMEZONES,
} from "@/client/lib/timezone-utils";

interface BusinessFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business?: BusinessProps | null;
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
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(business?.logo || null);
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);

  // Image upload hook for logo (used when editing an existing business)
  const {
    upload: uploadLogo,
    isUploading: isUploadingLogo,
    status: logoUploadStatus,
    previewUrl: uploadPreviewUrl,
  } = useImageUpload({
    storagePath: business?.id
      ? STORAGE_PATHS.businessLogo(business.id)
      : "businesses/placeholder/logo",
    preset: "logo",
    onSuccess: (result) => {
      logger.info(
        "BusinessFormDialog",
        "system",
        `Logo uploaded: ${result.compressionRatio}% compression`
      );
      setLogoUrl(result.url);
      toast.success("Logo subido exitosamente");
    },
    onError: (err) => {
      toast.error(err.message || "Error al subir el logo");
    },
  });

  const createMutation = useTrpc.business.create.useMutation({
    onSuccess: async (createdBusiness) => {
      // Upload the pending logo now that we have the real business ID
      if (pendingLogoFile) {
        try {
          const { uploadImage } = await import(
            "@/client/lib/storage/image-upload.service"
          );
          const result = await uploadImage({
            file: pendingLogoFile,
            storagePath: STORAGE_PATHS.businessLogo(createdBusiness.id!),
            preset: "logo",
          });
          await updateMutation.mutateAsync({
            id: createdBusiness.id!,
            logo: result.url,
          });
        } catch (err) {
          logger.error(
            "BusinessFormDialog",
            "system",
            `Failed to upload logo after business creation: ${err}`
          );
        }
      }
      toast.success("Negocio creado exitosamente");
      onOpenChange(false);
      if (onClose) onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Error al crear el negocio");
    },
  });

  const updateMutation = useTrpc.business.update.useMutation({
    onSuccess: () => {
      toast.success("Negocio actualizado exitosamente");
      onOpenChange(false);
      if (onClose) onClose();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el negocio");
    },
  });

  const isLoading =
    createMutation.isPending || updateMutation.isPending || isUploadingLogo;

  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    timeZone: string;
    locale: string;
    currency: string;
    status: "active" | "inactive" | "suspended";
  }>({
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
    timeZone: business?.timeZone || getBrowserTimezone(),
    locale: business?.locale || "en",
    currency: business?.currency || "USD",
    status:
      (business?.status as "active" | "inactive" | "suspended") || "active",
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

  const handleLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (business?.id) {
      // Editing: upload immediately with real business ID
      await uploadLogo(file);
    } else {
      // Creating: store file and show local preview; upload after business is created
      setPendingLogoFile(file);
      setLogoPreviewUrl(URL.createObjectURL(file));
    }

    // Reset input so same file can be selected again
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const getLogoStatusMessage = () => {
    switch (logoUploadStatus) {
      case "processing":
        return "Procesando imagen...";
      case "uploading":
        return "Subiendo...";
      default:
        return "Cambiar logo";
    }
  };

  // Determine which image to show for logo
  const displayLogoSrc =
    (isUploadingLogo && uploadPreviewUrl
      ? uploadPreviewUrl
      : logoUrl || undefined) ??
    logoPreviewUrl ??
    undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (business && business.id) {
      // Update existing business
      updateMutation.mutate({
        id: business.id,
        ...formData,
        logo: logoUrl || undefined,
      });
    } else {
      // Create new business
      createMutation.mutate({
        ...formData,
        logo: logoUrl || undefined,
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-xl">
            {business
              ? t.pages.business.editBusiness
              : t.pages.business.addBusiness}
          </SheetTitle>
          <SheetDescription>
            {business
              ? "Actualiza la información de tu negocio"
              : "Completa la información para crear un nuevo negocio"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">
                  {t.pages.business.form.basicInfo}
                </h3>

                {/* Logo Upload */}
                <div className="flex flex-col items-center space-y-3">
                  <Label>Logo del negocio</Label>
                  <div className="relative group">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={displayLogoSrc}
                        alt="Logo del negocio"
                        className={
                          isUploadingLogo
                            ? "blur-sm opacity-70 transition-all"
                            : "transition-all"
                        }
                      />
                      <AvatarFallback className="text-2xl bg-muted">
                        <Building2 className="h-10 w-10 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>

                    {/* Upload overlay */}
                    <button
                      type="button"
                      onClick={handleLogoClick}
                      disabled={isUploadingLogo || isLoading}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-not-allowed disabled:opacity-100"
                    >
                      {isUploadingLogo ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </button>
                  </div>

                  {/* Status message */}
                  {isUploadingLogo && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      {getLogoStatusMessage()}
                    </p>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleLogoChange}
                    className="hidden"
                    disabled={isUploadingLogo || isLoading}
                  />

                  {/* Upload button */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLogoClick}
                    disabled={isUploadingLogo || isLoading}
                  >
                    {isUploadingLogo ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {getLogoStatusMessage()}
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        {logoUrl ? "Cambiar logo" : "Subir logo"}
                      </>
                    )}
                  </Button>

                  {/* Info text */}
                  <p className="text-xs text-muted-foreground text-center">
                    Formatos: JPG, PNG, WebP, GIF
                    <br />
                    Tamaño máximo: 10MB
                    <br />
                    Se redimensionará a 512x512px
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {t.pages.business.form.title} *
                    </Label>
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
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
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
                    <Label htmlFor="email">
                      {t.pages.business.form.email} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      {t.pages.business.form.phone} *
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">
                    {t.pages.business.form.website}
                  </Label>
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
                      onChange={(e) =>
                        handleChange("postalCode", e.target.value)
                      }
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
                        {SUPPORTED_TIMEZONES.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locale">
                      {t.pages.business.form.locale}
                    </Label>
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
                        <SelectGroup>
                          <SelectLabel>Norteamérica</SelectLabel>
                          <SelectItem value="USD">
                            USD — Dólar estadounidense ($)
                          </SelectItem>
                          <SelectItem value="CAD">
                            CAD — Dólar canadiense (CA$)
                          </SelectItem>
                          <SelectItem value="MXN">
                            MXN — Peso mexicano ($)
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Latinoamérica</SelectLabel>
                          <SelectItem value="ARS">
                            ARS — Peso argentino ($)
                          </SelectItem>
                          <SelectItem value="BOB">
                            BOB — Boliviano (Bs)
                          </SelectItem>
                          <SelectItem value="BRL">
                            BRL — Real brasileño (R$)
                          </SelectItem>
                          <SelectItem value="CLP">
                            CLP — Peso chileno ($)
                          </SelectItem>
                          <SelectItem value="COP">
                            COP — Peso colombiano ($)
                          </SelectItem>
                          <SelectItem value="CRC">
                            CRC — Colón costarricense (₡)
                          </SelectItem>
                          <SelectItem value="CUP">
                            CUP — Peso cubano ($)
                          </SelectItem>
                          <SelectItem value="DOP">
                            DOP — Peso dominicano ($)
                          </SelectItem>
                          <SelectItem value="GTQ">GTQ — Quetzal (Q)</SelectItem>
                          <SelectItem value="HNL">HNL — Lempira (L)</SelectItem>
                          <SelectItem value="NIO">
                            NIO — Córdoba (C$)
                          </SelectItem>
                          <SelectItem value="PAB">
                            PAB — Balboa (B/.)
                          </SelectItem>
                          <SelectItem value="PEN">
                            PEN — Sol peruano (S/)
                          </SelectItem>
                          <SelectItem value="PYG">PYG — Guaraní (₲)</SelectItem>
                          <SelectItem value="SVC">
                            SVC — Colón salvadoreño (₡)
                          </SelectItem>
                          <SelectItem value="UYU">
                            UYU — Peso uruguayo ($)
                          </SelectItem>
                          <SelectItem value="VES">
                            VES — Bolívar (Bs.S)
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Europa</SelectLabel>
                          <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                          <SelectItem value="GBP">
                            GBP — Libra esterlina (£)
                          </SelectItem>
                          <SelectItem value="CHF">
                            CHF — Franco suizo (CHF)
                          </SelectItem>
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Otros</SelectLabel>
                          <SelectItem value="AUD">
                            AUD — Dólar australiano (A$)
                          </SelectItem>
                          <SelectItem value="NZD">
                            NZD — Dólar neozelandés (NZ$)
                          </SelectItem>
                          <SelectItem value="JPY">JPY — Yen (¥)</SelectItem>
                          <SelectItem value="CNY">CNY — Yuan (¥)</SelectItem>
                          <SelectItem value="KRW">KRW — Won (₩)</SelectItem>
                          <SelectItem value="INR">
                            INR — Rupia india (₹)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">{t.pages.business.form.status}</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      handleChange(
                        "status",
                        value as "active" | "inactive" | "suspended"
                      )
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
          </div>

          <div className="flex gap-3 px-6 py-4 border-t bg-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                if (onClose) onClose();
              }}
              disabled={isLoading}
              className="flex-1"
            >
              {t.pages.business.actions.cancel}
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Guardando..." : t.pages.business.actions.save}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
