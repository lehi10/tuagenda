"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { Card, CardContent } from "@/client/components/ui/card";
import { useTranslation } from "@/client/i18n";
import { Clock, DollarSign, Loader2 } from "lucide-react";
import { useTrpc } from "@/client/lib/trpc";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  price: number;
  categoryId: string | null;
}

interface ServiceSelectionProps {
  businessId: string;
  onSelect: (_service: Service) => void;
  selectedServiceId?: string;
}

export function ServiceSelection({
  businessId,
  onSelect,
  selectedServiceId,
}: ServiceSelectionProps) {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useTrpc.serviceCategory.listPublic.useQuery(
      { businessId },
      { enabled: !!businessId }
    );

  // Fetch services
  const { data: servicesData, isLoading: isLoadingServices } =
    useTrpc.service.listPublic.useQuery(
      {
        businessId,
        categoryId: categoryFilter === "all" ? null : categoryFilter,
      },
      { enabled: !!businessId }
    );

  const categories = categoriesData?.categories || [];
  const services = servicesData?.services || [];
  const isLoading = isLoadingCategories || isLoadingServices;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.booking.service.title}
        </h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Services Grid */}
      {!isLoading && services.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {t.booking.service.noServices}
        </div>
      )}

      {!isLoading && services.length > 0 && (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedServiceId === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(service)}
            >
              <CardContent className="p-3 sm:p-4">
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
                    <span>${service.price.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
