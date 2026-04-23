/**
 * Service Selection View (Presentational Component)
 *
 * Pure UI component that displays services and categories.
 * All data and handlers are passed via props.
 * No data fetching or business logic.
 */

"use client";

import { useTranslation } from "@/client/i18n";
import { Clock, Package } from "lucide-react";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import { EmptyState } from "@/client/components/booking/shared/empty-state";
import { formatPrice } from "@/client/lib/booking-utils";
import { cn } from "@/client/lib/utils";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

export interface ServiceSelectionViewProps {
  categories: ServiceCategory[];
  services: BookingService[];
  allServices: BookingService[];
  isLoading: boolean;
  categoryFilter: string;
  selectedServiceId?: string;
  onCategoryFilterChange: (categoryId: string) => void;
  onServiceSelect: (service: BookingService) => void;
}

export function ServiceSelectionView({
  categories,
  services,
  allServices,
  isLoading,
  categoryFilter,
  selectedServiceId,
  onCategoryFilterChange,
  onServiceSelect,
}: ServiceSelectionViewProps) {
  const { t, locale } = useTranslation();

  const getServiceCount = (categoryId: string) => {
    if (categoryId === "all") return allServices.length;
    return allServices.filter((s) => s.categoryId === categoryId).length;
  };

  const tabs = [
    {
      id: "all",
      label: locale === "es" ? "Todos" : "All",
      count: getServiceCount("all"),
    },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: getServiceCount(c.id),
    })),
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.service.title}
        </h2>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Elige el servicio que necesitas"
            : "Choose the service you need"}
        </p>
      </div>

      {/* Category Tab Pills */}
      {tabs.length > 1 && (
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-1.5 border-b pb-0 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryFilterChange(tab.id)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all",
                  categoryFilter === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
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

      {/* Loading State */}
      {isLoading && <LoadingSpinner fullScreen />}

      {/* Empty State */}
      {!isLoading && services.length === 0 && (
        <EmptyState icon={Package} message={t.booking.service.noServices} />
      )}

      {/* Services Grid */}
      {!isLoading && services.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {services.map((service) => {
            const isSelected = selectedServiceId === service.id;
            const isFree = service.price === 0;

            return (
              <button
                key={service.id}
                onClick={() => onServiceSelect(service)}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all",
                  "hover:shadow-md active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-md"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className="flex gap-3 items-start">
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl",
                      isSelected ? "bg-primary/15" : "bg-primary/10"
                    )}
                  >
                    📋
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug mb-1">
                      {service.name}
                    </p>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {service.durationMinutes} {t.booking.summary.minutes}
                        </span>
                      </div>
                    </div>
                    {service.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>

                  {/* Price */}
                  <div className="shrink-0 text-right ml-2">
                    {isFree ? (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                        Gratis
                      </span>
                    ) : service.price ? (
                      <span className="text-sm font-bold text-primary">
                        {formatPrice(service.price)}
                      </span>
                    ) : null}
                    <p className="text-xs text-primary/70 font-medium mt-1">
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
