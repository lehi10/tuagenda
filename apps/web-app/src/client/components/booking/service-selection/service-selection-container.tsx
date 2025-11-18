/**
 * Service Selection Container (Smart Component)
 *
 * Handles data fetching and state management for service selection.
 * Delegates presentation to ServiceSelectionView.
 */

"use client";

import { useState } from "react";
import { useTrpc } from "@/client/lib/trpc";
import { ServiceSelectionView } from "./service-selection-view";
import type { BookingService } from "@/client/types/booking";

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

  // Fetch services (filtered by category if selected)
  const { data: servicesData, isLoading: isLoadingServices } =
    useTrpc.service.listPublic.useQuery(
      {
        businessId,
        ...(categoryFilter !== "all" ? { categoryId: categoryFilter } : {}),
      },
      { enabled: !!businessId }
    );

  // Extract data with defaults and filter out any without IDs
  const categories = (categoriesData?.categories || []).filter(
    (cat) => cat.id
  ) as any;
  const services = (servicesData?.services || []).filter(
    (service) => service.id
  ) as any;
  const isLoading = isLoadingCategories || isLoadingServices;

  return (
    <ServiceSelectionView
      categories={categories}
      services={services}
      isLoading={isLoading}
      categoryFilter={categoryFilter}
      selectedServiceId={selectedServiceId}
      onCategoryFilterChange={setCategoryFilter}
      onServiceSelect={onSelect}
    />
  );
}
