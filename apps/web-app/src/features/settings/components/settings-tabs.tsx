"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Building2,
  Bell,
  Clock,
  CreditCard,
  Plug,
  Shield,
} from "lucide-react";

export function SettingsTabs() {
  const settingsSections = [
    {
      icon: Settings,
      title: "General",
      description:
        "Usa estos ajustes para definir la configuración general del plugin y la configuración predeterminada para tus servicios y citas",
      action: "Ver ajustes",
    },
    {
      icon: Building2,
      title: "Empresa",
      description:
        "Utilice estos ajustes para configurar la imagen, el nombre, la dirección, el teléfono y el sitio web de su empresa",
      action: "Ver ajustes",
    },
    {
      icon: Bell,
      title: "Notificaciones",
      description:
        "Use esta configuración para establecer tus ajustes de correo que se utilizarán para notificar a tus clientes y empleados",
      action: "Ver ajustes",
    },
    {
      icon: Clock,
      title: "Horas laborales y días de descanso",
      description:
        "Utilice estos ajustes para establecer las horas de trabajo y los días libres de la empresa que se aplicarán a cada empleado",
      action: "Ver ajustes",
    },
    {
      icon: CreditCard,
      title: "Pagos",
      description:
        "Usa esta opción de configuración para las opciones y métodos de pago, así como el formato de precio",
      action: "Ver ajustes",
    },
    {
      icon: Plug,
      title: "Integraciones",
      description:
        "Maneje la integración del calendario de Google, la integración del calendario de Outlook, la integración de Zoom y los Web Hooks",
      action: "Ver ajustes",
    },
    {
      icon: Shield,
      title: "Configuración de roles",
      description:
        "Utilice esta configuración para definir los ajustes que se aplicarán a las funciones específicas de Amelia",
      action: "Ver ajustes",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {settingsSections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Card
            key={index}
            className="hover:shadow-lg transition-all hover:scale-[1.02] flex flex-col overflow-hidden"
          >
            <CardHeader className="pb-0 pt-0 px-4">
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-base font-semibold break-words">
                  {section.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 flex flex-col flex-1 overflow-hidden pt-0 px-4 pb-3">
              <CardDescription className="text-xs leading-snug text-center flex-1 break-words">
                {section.description}
              </CardDescription>
              <Button
                variant="outline"
                className="w-full hover:bg-primary hover:text-primary-foreground shrink-0 text-sm h-9"
              >
                {section.action}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
