/**
 * Professional Selection Container (Smart Component)
 *
 * Handles data fetching and state management for professional selection.
 * Delegates presentation to ProfessionalSelectionView.
 */

"use client";

import { useTrpc } from "@/client/lib/trpc";
import { ProfessionalSelectionView } from "./professional-selection-view";
import type { Professional } from "@/client/types/booking";

interface ProfessionalSelectionContainerProps {
  businessId: string;
  onSelect: (professional: { id: string; name: string }) => void;
  selectedProfessionalId?: string;
  serviceId?: string; // Optional: filter by professionals who can provide this service
}

export function ProfessionalSelectionContainer({
  businessId,
  onSelect,
  selectedProfessionalId,
  serviceId,
}: ProfessionalSelectionContainerProps) {
  // Fetch employees/professionals
  const { data: employeesData, isLoading } =
    useTrpc.businessUser.listPublicEmployees.useQuery(
      {
        businessId,
        ...(serviceId ? { serviceId } : {}),
      },
      { enabled: !!businessId }
    );

  // Extract data with defaults
  const employees = employeesData?.employees || [];

  // Map employees to Professional format
  const professionals: Professional[] = employees.map((employee) => ({
    id: employee.id,
    name: employee.name,
    role: "Profesional", // Default role - could be customized based on business needs
    avatar:
      employee.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.name}`,
    available: true, // All returned employees are active
  }));

  return (
    <ProfessionalSelectionView
      professionals={professionals}
      isLoading={isLoading}
      selectedProfessionalId={selectedProfessionalId}
      onProfessionalSelect={onSelect}
    />
  );
}
