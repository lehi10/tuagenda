"use client";

import {
  MoreVertical,
  Pencil,
  Trash2,
  Clock,
  Wifi,
  MapPin,
  CreditCard,
} from "lucide-react";
import { Button } from "@/client/components/ui/button";
import { Switch } from "@/client/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { cn } from "@/client/lib/utils";
import type { ServiceData } from "../types";

interface ServiceCardProps {
  service: ServiceData;
  currency: string;
  onEdit: (service: ServiceData) => void;
  onDelete: (service: ServiceData) => void;
  onToggleActive: (service: ServiceData, active: boolean) => void;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

function formatPrice(price: number, currency: string): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency,
  }).format(price);
}

export function ServiceCard({
  service,
  currency,
  onEdit,
  onDelete,
  onToggleActive,
}: ServiceCardProps) {
  const isFree = service.price === 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-3 rounded-xl border bg-card p-4 transition-shadow hover:shadow-sm",
        !service.active && "opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold leading-snug">{service.name}</p>
          {service.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {service.description}
            </p>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(service)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(service)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
            service.isVirtual
              ? "bg-blue-50 text-blue-600"
              : "bg-muted text-muted-foreground"
          )}
        >
          {service.isVirtual ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <MapPin className="h-3 w-3" />
          )}
          {service.isVirtual ? "Virtual" : "Presencial"}
        </span>
        {service.requiresOnlinePayment && (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
            <CreditCard className="h-3 w-3" />
            Pago online
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{formatDuration(service.durationMinutes)}</span>
        </div>

        <div className="flex items-center gap-3">
          {isFree ? (
            <span className="text-sm font-semibold text-green-600">Gratis</span>
          ) : (
            <span className="text-sm font-semibold">
              {formatPrice(service.price, currency)}
            </span>
          )}
          <Switch
            checked={service.active}
            onCheckedChange={(checked) => onToggleActive(service, checked)}
          />
        </div>
      </div>
    </div>
  );
}
