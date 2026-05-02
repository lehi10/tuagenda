"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, MessageCircle } from "lucide-react";

import { Button } from "@/client/components/ui/button";
import { Badge } from "@/client/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Switch } from "@/client/components/ui/switch";
import { useTrpc } from "@/client/lib/trpc";
import type {
  Business,
  BusinessNotificationSettings,
} from "@/shared/types/business";
import { NotificationChannel } from "@/shared/types/business";

const schema = z.object({
  emailEnabled: z.boolean(),
  whatsappEnabled: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  business: Business;
  onUpdate?: () => void;
}

function channelsFromSettings(
  settings: BusinessNotificationSettings | null | undefined
): FormValues {
  const channels = settings?.channels ?? [];
  return {
    emailEnabled: channels.includes(NotificationChannel.EMAIL),
    whatsappEnabled: channels.includes(NotificationChannel.WHATSAPP),
  };
}

export function NotificationChannelsSection({ business, onUpdate }: Props) {
  const settings =
    business.notificationSettings as BusinessNotificationSettings | null;

  const updateMutation =
    useTrpc.business.updateNotificationSettings.useMutation({
      onSuccess: () => {
        toast.success("Configuración de notificaciones guardada");
        onUpdate?.();
      },
      onError: (error) => {
        toast.error(error.message || "Error al guardar");
      },
    });

  const { control, handleSubmit, watch } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: channelsFromSettings(settings),
  });

  const emailEnabled = watch("emailEnabled");

  const onSubmit = (data: FormValues) => {
    const channels: string[] = [];
    if (data.emailEnabled) channels.push(NotificationChannel.EMAIL);
    if (data.whatsappEnabled) channels.push(NotificationChannel.WHATSAPP);

    updateMutation.mutate({
      id: business.id!,
      notificationSettings:
        channels.length > 0
          ? { channels: channels as ("email" | "whatsapp")[] }
          : null,
    });
  };

  const isLoading = updateMutation.isPending;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Canales de notificación</CardTitle>
            <CardDescription>
              Activa los canales por los que tus clientes recibirán
              notificaciones de sus citas. Se usan plantillas predeterminadas.
            </CardDescription>
          </div>
          <Button
            type="submit"
            form="notification-channels-form"
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
          id="notification-channels-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-0 divide-y divide-border"
        >
          {/* Email channel */}
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-muted-foreground">
                    {emailEnabled
                      ? "Plantilla predeterminada activa"
                      : "Desactivado"}
                  </p>
                </div>
              </div>
              <Controller
                control={control}
                name="emailEnabled"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          </div>

          {/* WhatsApp channel — coming soon */}
          <div className="py-4 opacity-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    WhatsApp
                    <Badge variant="secondary" className="text-xs">
                      Pronto
                    </Badge>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    No disponible aún
                  </p>
                </div>
              </div>
              <Controller
                control={control}
                name="whatsappEnabled"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled
                  />
                )}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
