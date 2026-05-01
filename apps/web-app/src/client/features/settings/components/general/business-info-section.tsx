"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Loader2, Building2 } from "lucide-react";

import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Input } from "@/client/components/ui/input";
import { Textarea } from "@/client/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/client/components/ui/field";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { useTrpc } from "@/client/lib/trpc";
import { useImageUpload } from "@/client/hooks/use-image-upload";
import { STORAGE_PATHS } from "@/shared/constants/image.constants";
import type { Business } from "@/shared/types/business";

const schema = z.object({
  title: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  website: z.union([
    z.string().url("URL inválida"),
    z.literal(""),
    z.undefined(),
  ]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  business: Business;
  onUpdate?: () => void;
}

export function BusinessInfoSection({ business, onUpdate }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(business.logo ?? null);

  const {
    upload: uploadLogo,
    isUploading,
    previewUrl,
    status: uploadStatus,
  } = useImageUpload({
    storagePath: STORAGE_PATHS.businessLogo(business.id!),
    preset: "logo",
    onSuccess: (result) => {
      setLogoUrl(result.url);
      updateMutation.mutate({ id: business.id!, logo: result.url });
      toast.success("Logo actualizado");
    },
    onError: (err) => {
      toast.error(err.message || "Error al subir el logo");
    },
  });

  const updateMutation = useTrpc.business.update.useMutation({
    onSuccess: () => {
      toast.success("Información actualizada correctamente");
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: business.title,
      description: business.description ?? "",
      email: business.email,
      phone: business.phone,
      website: business.website ?? "",
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      id: business.id!,
      ...data,
      description: data.description || undefined,
      website: data.website || undefined,
    });
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadLogo(file);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const displayLogo =
    (isUploading && previewUrl ? previewUrl : logoUrl) ?? undefined;
  const isLoading = updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del negocio</CardTitle>
        <CardDescription>
          Nombre, descripción y datos de contacto de tu negocio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Logo */}
          <Field>
            <FieldLabel>Logo</FieldLabel>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={displayLogo}
                    alt="Logo"
                    className={isUploading ? "blur-sm opacity-70" : ""}
                  />
                  <AvatarFallback className="bg-muted">
                    <Building2 className="h-7 w-7 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
              <div className="space-y-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      {uploadStatus === "processing"
                        ? "Procesando..."
                        : "Subiendo..."}
                    </>
                  ) : (
                    <>{logoUrl ? "Cambiar logo" : "Subir logo"}</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP · Máx. 10MB
                </p>
              </div>
            </div>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleLogoChange}
              className="hidden"
            />
          </Field>

          {/* Slug (read-only) */}
          <Field>
            <FieldLabel>Slug</FieldLabel>
            <Input value={business.slug} disabled readOnly />
            <FieldDescription>
              El slug identifica tu negocio en las URLs y no puede modificarse.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>
              Nombre <span className="text-destructive">*</span>
            </FieldLabel>
            <Input {...register("title")} disabled={isLoading} />
            <FieldError>{errors.title?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Descripción</FieldLabel>
            <Textarea
              {...register("description")}
              rows={3}
              disabled={isLoading}
            />
            <FieldError>{errors.description?.message}</FieldError>
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <FieldLabel>
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("email")} type="email" disabled={isLoading} />
              <FieldError>{errors.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>
                Teléfono <span className="text-destructive">*</span>
              </FieldLabel>
              <Input {...register("phone")} type="tel" disabled={isLoading} />
              <FieldError>{errors.phone?.message}</FieldError>
            </Field>
          </div>

          <Field>
            <FieldLabel>Sitio web</FieldLabel>
            <Input
              {...register("website")}
              placeholder="https://tunegocio.com"
              disabled={isLoading}
            />
            <FieldError>{errors.website?.message}</FieldError>
          </Field>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
