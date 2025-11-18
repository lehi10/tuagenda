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
  SelectValue,
} from "@/client/components/ui/select";
import { useTranslation } from "@/client/i18n";
import { Clock, DollarSign, Package } from "lucide-react";
import { SelectableCard } from "@/client/components/booking/shared/selectable-card";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import { EmptyState } from "@/client/components/booking/shared/empty-state";
import { formatPrice } from "@/client/lib/booking-utils";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

export interface ServiceSelectionViewProps {
  // Data
  categories: ServiceCategory[];
  services: BookingService[];

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
  isLoading,
  categoryFilter,
  selectedServiceId,
  onCategoryFilterChange,
  onServiceSelect,
}: ServiceSelectionViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.booking.service.title}
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t.booking.service.filterByCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t.booking.service.allCategories}
            </SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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

      {/* Services Grid */}
      {!isLoading && services.length > 0 && (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <SelectableCard
              key={service.id}
              isSelected={selectedServiceId === service.id}
              onClick={() => onServiceSelect(service)}
            >
              <h3 className="font-semibold text-sm sm:text-base line-clamp-1 mb-2">
                {service.name}
              </h3>

              {service.description && (
                <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>
                    {service.durationMinutes} {t.booking.summary.minutes}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatPrice(service.price)}</span>
                </div>
              </div>
            </SelectableCard>
          ))}
        </div>
      )}
    </div>
  );
}
