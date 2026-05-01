"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Loader2, Building2, ImagePlus } from "lucide-react";

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
import { Field, FieldLabel, FieldError } from "@/client/components/ui/field";
import { useTrpc } from "@/client/lib/trpc";
import { useImageUpload } from "@/client/hooks/use-image-upload";
import { STORAGE_PATHS } from "@/shared/constants/image.constants";
import type { Business } from "@/shared/types/business";

const schema = z.object({
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
      description: business.description ?? "",
      email: business.email,
      phone: business.phone,
      website: business.website ?? "",
    },
  });

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate({
      id: business.id!,
      description: data.description || undefined,
      email: data.email,
      phone: data.phone,
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
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Información del negocio</CardTitle>
            <CardDescription>
              Nombre, descripción y datos de contacto de tu negocio
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="business-info-form"
            disabled={isLoading}
            size="sm"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form
          id="business-info-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          {/* Logo + Slug row */}
          <div className="flex items-center gap-4">
            {/* Clickable logo zone */}
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploading}
              className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/40 transition-colors hover:border-primary/50 hover:bg-muted/70 disabled:pointer-events-none"
            >
              {displayLogo ? (
                <>
                  <img
                    src={displayLogo}
                    alt="Logo"
                    className={`h-full w-full object-contain p-1.5 transition-opacity${isUploading ? " opacity-40" : ""}`}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Camera className="h-4 w-4 text-white" />
                    <span className="text-[10px] text-white">Cambiar</span>
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-1">
                  {isUploading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-foreground" />
                      <span className="text-[10px] text-muted-foreground">
                        Logo
                      </span>
                    </>
                  )}
                </div>
              )}
            </button>

            <div className="flex min-w-0 flex-col gap-0.5">
              <p className="truncate text-base font-semibold">
                {business.title}
              </p>
              <p className="font-mono text-xs text-muted-foreground">
                /{business.slug}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG, WebP · Máx. 10MB
              </p>
              {isUploading && (
                <p className="flex items-center gap-1 text-xs text-primary">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {uploadStatus === "processing"
                    ? "Procesando..."
                    : "Subiendo..."}
                </p>
              )}
            </div>
          </div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <Field className="sm:col-span-2">
              <FieldLabel>Sitio web</FieldLabel>
              <Input
                {...register("website")}
                placeholder="https://tunegocio.com"
                disabled={isLoading}
              />
              <FieldError>{errors.website?.message}</FieldError>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel>Descripción</FieldLabel>
              <Textarea
                {...register("description")}
                rows={2}
                disabled={isLoading}
              />
              <FieldError>{errors.description?.message}</FieldError>
            </Field>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
