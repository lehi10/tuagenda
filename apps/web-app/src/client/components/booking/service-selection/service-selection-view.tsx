/**
 * Service Selection View (Presentational Component)
 *
 * Pure UI component that displays services and categories.
 * All data and handlers are passed via props.
 * No data fetching or business logic.
 */

"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/client/components/ui/select";
import { useTranslation } from "@/client/i18n";
import { Clock, Package, Check, FolderOpen } from "lucide-react";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import { EmptyState } from "@/client/components/booking/shared/empty-state";
import { formatPrice } from "@/client/lib/booking-utils";
import { cn } from "@/client/lib/utils";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

export interface ServiceSelectionViewProps {
  // Data
  categories: ServiceCategory[];
  services: BookingService[];
  allServices: BookingService[]; // All services for counting

  // State
  isLoading: boolean;
  categoryFilter: string;
  selectedServiceId?: string;

  // Handlers
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

  // Count services per category
  const getServiceCount = (categoryId: string) => {
    if (categoryId === "all") return allServices.length;
    return allServices.filter((s) => s.categoryId === categoryId).length;
  };

  // Get current category name
  const getCurrentCategoryName = () => {
    if (categoryFilter === "all") {
      return locale === "es" ? "Todas las categorías" : "All categories";
    }
    const category = categories.find((c) => c.id === categoryFilter);
    return category?.name || "";
  };

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

      {/* Category Filter - Improved dropdown */}
      <div>
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full sm:w-[280px] h-12">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{getCurrentCategoryName()}</span>
              <span className="text-xs text-muted-foreground ml-auto mr-2">
                ({getServiceCount(categoryFilter)})
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center justify-between w-full gap-4">
                <span>
                  {locale === "es" ? "Todas las categorías" : "All categories"}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({getServiceCount("all")})
                </span>
              </div>
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center justify-between w-full gap-4">
                  <span>{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({getServiceCount(category.id)})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner fullScreen />}

      {/* Empty State */}
      {!isLoading && services.length === 0 && (
        <EmptyState icon={Package} message={t.booking.service.noServices} />
      )}

      {/* Services List (Mobile) / Grid (Desktop) */}
      {!isLoading && services.length > 0 && (
        <>
          {/* Mobile: Vertical list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => onServiceSelect(service)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    "hover:border-primary/50 hover:bg-muted/50",
                    "active:scale-[0.98]",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base">
                        {service.name}
                      </h3>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          {service.durationMinutes} {t.booking.summary.minutes}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-lg">
                        {formatPrice(service.price)}
                      </span>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Desktop: Grid */}
          <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const isSelected = selectedServiceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => onServiceSelect(service)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all relative",
                    "hover:border-primary/50 hover:shadow-md",
                    isSelected
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card"
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                  <h3 className="font-semibold text-base pr-8 line-clamp-1">
                    {service.name}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {service.durationMinutes} {t.booking.summary.minutes}
                      </span>
                    </div>
                    <span className="font-bold text-lg">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
