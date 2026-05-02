"use client";

import { Badge } from "@/client/components/ui/badge";
import {
  Settings,
  Bell,
  Clock,
  Plug,
  Shield,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface SettingsSection {
  icon: React.ElementType;
  title: string;
  description: string;
  href?: string;
}

const settingsSections: SettingsSection[] = [
  {
    icon: Settings,
    title: "General",
    description:
      "Configuración general y valores predeterminados para tus servicios y citas",
    href: "/settings/general",
  },
  {
    icon: Bell,
    title: "Notificaciones",
    description: "Ajustes de correo para notificar a tus clientes y empleados",
    href: "/settings/notifications",
  },
  {
    icon: Clock,
    title: "Horas laborales y días de descanso",
    description:
      "Horas de trabajo y días libres que se aplican a cada empleado",
  },
  {
    icon: Plug,
    title: "Integraciones",
    description: "Google Calendar, Outlook, Zoom y Web Hooks",
  },
  {
    icon: Shield,
    title: "Configuración de roles",
    description: "Ajustes aplicados a las funciones específicas de cada rol",
  },
];

export function SettingsTabs() {
  return (
    <div className="divide-y divide-border rounded-xl border bg-card">
      {settingsSections.map((section) => {
        const Icon = section.icon;
        const enabled = !!section.href;

        const inner = (
          <div
            className={`flex items-center gap-4 px-5 py-4 transition-colors ${
              enabled
                ? "hover:bg-muted/50 cursor-pointer"
                : "opacity-50 cursor-default"
            }`}
          >
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-none mb-1">
                {section.title}
              </p>
              <p className="text-xs text-muted-foreground leading-snug">
                {section.description}
              </p>
            </div>

            <div className="shrink-0">
              {enabled ? (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Muy pronto
                </Badge>
              )}
            </div>
          </div>
        );

        return enabled ? (
          <Link key={section.title} href={section.href!}>
            {inner}
          </Link>
        ) : (
          <div key={section.title}>{inner}</div>
        );
      })}
    </div>
  );
}
