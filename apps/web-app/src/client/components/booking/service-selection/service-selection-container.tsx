/**
 * Service Selection Container (Smart Component)
 *
 * Handles data fetching and state management for service selection.
 * Delegates presentation to ServiceSelectionView.
 */

"use client";

import { useState, useMemo } from "react";
import { useTrpc } from "@/client/lib/trpc";
import { ServiceSelectionView } from "./service-selection-view";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

interface ServiceSelectionContainerProps {
  businessId: string;
  onSelect: (service: BookingService) => void;
  selectedServiceId?: string;
}

export function ServiceSelectionContainer({
  businessId,
  onSelect,
  selectedServiceId,
}: ServiceSelectionContainerProps) {
  // Local state for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch categories
  const { data: categoriesData, isLoading: isLoadingCategories } =
    useTrpc.serviceCategory.listPublic.useQuery(
      { businessId },
      { enabled: !!businessId }
    );

  // Fetch all services (for counting and filtering locally)
  const { data: allServicesData, isLoading: isLoadingServices } =
    useTrpc.service.listPublic.useQuery(
      { businessId },
      { enabled: !!businessId }
    );

  // Extract data with defaults
  const categories = useMemo(() => {
    return (categoriesData?.categories || []).filter(
      (cat) => cat.id
    ) as ServiceCategory[];
  }, [categoriesData]);

  const allServices = useMemo(() => {
    return (allServicesData?.services || []).filter(
      (service) => service.id
    ) as BookingService[];
  }, [allServicesData]);

  // Filter services locally based on category
  const filteredServices = useMemo(() => {
    if (categoryFilter === "all") return allServices;
    return allServices.filter(
      (service) => service.categoryId === categoryFilter
    );
  }, [allServices, categoryFilter]);

  const isLoading = isLoadingCategories || isLoadingServices;

  return (
    <ServiceSelectionView
      categories={categories}
      services={filteredServices}
      allServices={allServices}
      isLoading={isLoading}
      categoryFilter={categoryFilter}
      selectedServiceId={selectedServiceId}
      onCategoryFilterChange={setCategoryFilter}
      onServiceSelect={onSelect}
    />
  );
}
