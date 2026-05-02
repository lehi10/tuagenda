"use client";

import { useState, useMemo } from "react";
import { useTrpc } from "@/client/lib/trpc";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

export function useBusinessProfile(businessId: string) {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: categoriesData } = useTrpc.serviceCategory.listPublic.useQuery(
    { businessId },
    { enabled: !!businessId }
  );
  const { data: servicesData, isLoading } = useTrpc.service.listPublic.useQuery(
    { businessId },
    { enabled: !!businessId }
  );

  const categories = useMemo(
    () =>
      (categoriesData?.categories ?? []).filter(
        (c) => c.id
      ) as ServiceCategory[],
    [categoriesData]
  );

  const allServices = useMemo(
    () =>
      (servicesData?.services ?? []).filter((s) => s.id) as BookingService[],
    [servicesData]
  );

  const filteredServices = useMemo(
    () =>
      categoryFilter === "all"
        ? allServices
        : allServices.filter((s) => s.categoryId === categoryFilter),
    [allServices, categoryFilter]
  );

  const categoryTabs = [
    { id: "all", label: "Todos", count: allServices.length },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: allServices.filter((s) => s.categoryId === c.id).length,
    })),
  ];

  return {
    filteredServices,
    categoryTabs,
    categoryFilter,
    setCategoryFilter,
    isLoading,
  };
}
