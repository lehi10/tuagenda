"use client";

import { Clock } from "lucide-react";
import { cn } from "@/client/lib/utils";
import { formatPrice } from "@/client/lib/booking-utils";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import type { BookingService } from "@/client/types/booking";

function serviceEmoji(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("corte") || l.includes("cabello") || l.includes("peinado"))
    return "✂️";
  if (l.includes("uña") || l.includes("manicure") || l.includes("pedicure"))
    return "💅";
  if (l.includes("facial") || l.includes("limpieza")) return "✨";
  if (l.includes("médic") || l.includes("medic") || l.includes("dental"))
    return "🩺";
  if (l.includes("mecánic") || l.includes("mecanic")) return "🔧";
  if (l.includes("gym") || l.includes("entrenador") || l.includes("fitness"))
    return "💪";
  if (l.includes("propiedad") || l.includes("inmobil") || l.includes("terreno"))
    return "🏠";
  return "📋";
}

interface CategoryTab {
  id: string;
  label: string;
  count: number;
}

interface ServiceGridProps {
  services: BookingService[];
  categoryTabs: CategoryTab[];
  categoryFilter: string;
  isLoading: boolean;
  onCategoryChange: (id: string) => void;
  onServiceSelect: (service: BookingService) => void;
}

export function ServiceGrid({
  services,
  categoryTabs,
  categoryFilter,
  isLoading,
  onCategoryChange,
  onServiceSelect,
}: ServiceGridProps) {
  return (
    <div className="flex-1 min-w-0">
      {categoryTabs.length > 1 && (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
          <div className="flex gap-0 border-b min-w-max sm:min-w-0">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all",
                  categoryFilter === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                    categoryFilter === tab.id
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isLoading && <LoadingSpinner fullScreen />}

      {!isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const isFree = service.price === 0;
            const hasPrice =
              service.price !== null && service.price !== undefined;
            return (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border bg-card transition-all",
                  "hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
                )}
              >
                <div className="flex gap-3 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                    {serviceEmoji(service.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
                      {service.name}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {service.durationMinutes} min
                    </span>
                    {service.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-1">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right ml-2">
                    {isFree ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                        Gratis
                      </span>
                    ) : hasPrice ? (
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(service.price)}
                      </span>
                    ) : null}
                    <p className="text-xs text-primary/70 font-semibold mt-1">
                      Reservar →
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
