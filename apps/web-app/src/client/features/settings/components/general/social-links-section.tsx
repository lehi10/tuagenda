"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

import { Button } from "@/client/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Input } from "@/client/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/client/components/ui/field";
import { useTrpc } from "@/client/lib/trpc";
import type { Business } from "@/shared/types/business";

const urlOrEmpty = z.string().url("URL inválida").optional().or(z.literal(""));

const schema = z.object({
  instagram: urlOrEmpty,
  facebook: urlOrEmpty,
  twitter: urlOrEmpty,
  tiktok: urlOrEmpty,
  whatsapp: urlOrEmpty,
  linkedin: urlOrEmpty,
});

type FormValues = z.infer<typeof schema>;

interface Props {
  business: Business;
  onUpdate?: () => void;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function SocialLinksSection({ business, onUpdate }: Props) {
  const socialLinks = (business.socialLinks as Record<string, string>) ?? {};

  const updateMutation = useTrpc.business.update.useMutation({
    onSuccess: () => {
      toast.success("Redes sociales actualizadas");
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
      instagram: socialLinks.instagram ?? "",
      facebook: socialLinks.facebook ?? "",
      twitter: socialLinks.twitter ?? "",
      tiktok: socialLinks.tiktok ?? "",
      whatsapp: socialLinks.whatsapp ?? "",
      linkedin: socialLinks.linkedin ?? "",
    },
  });

  const onSubmit = (data: FormValues) => {
    const filtered = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v && v.length > 0)
    );
    updateMutation.mutate({
      id: business.id!,
      socialLinks: Object.keys(filtered).length > 0 ? filtered : null,
    });
  };

  const isLoading = updateMutation.isPending;

  const fields = [
    {
      name: "instagram" as const,
      label: "Instagram",
      icon: Instagram,
      placeholder: "https://instagram.com/tunegocio",
    },
    {
      name: "facebook" as const,
      label: "Facebook",
      icon: Facebook,
      placeholder: "https://facebook.com/tunegocio",
    },
    {
      name: "twitter" as const,
      label: "Twitter / X",
      icon: Twitter,
      placeholder: "https://x.com/tunegocio",
    },
    {
      name: "tiktok" as const,
      label: "TikTok",
      icon: TikTokIcon,
      placeholder: "https://tiktok.com/@tunegocio",
    },
    {
      name: "whatsapp" as const,
      label: "WhatsApp",
      icon: WhatsAppIcon,
      placeholder: "https://wa.me/51987654321",
    },
    {
      name: "linkedin" as const,
      label: "LinkedIn",
      icon: Linkedin,
      placeholder: "https://linkedin.com/in/tu-perfil",
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Redes sociales</CardTitle>
            <CardDescription>
              Links a los perfiles sociales de tu negocio
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="social-links-form"
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
          id="social-links-form"
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {fields.map(({ name, label, icon: Icon, placeholder }) => (
            <Field key={name}>
              <FieldLabel>{label}</FieldLabel>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register(name)}
                  placeholder={placeholder}
                  disabled={isLoading}
                  className="pl-9"
                />
              </div>
              <FieldError>{errors[name]?.message}</FieldError>
            </Field>
          ))}
        </form>
      </CardContent>
    </Card>
  );
}
