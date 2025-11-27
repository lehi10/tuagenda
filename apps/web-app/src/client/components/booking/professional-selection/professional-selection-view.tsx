/**
 * Professional Selection View (Presentational Component)
 *
 * Pure UI component that displays professionals.
 * All data and handlers are passed via props.
 * No data fetching or business logic.
 */

"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { useTranslation } from "@/client/i18n";
import { UserX, Check } from "lucide-react";
import { EmptyState } from "@/client/components/booking/shared/empty-state";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import { getInitials } from "@/client/lib/booking-utils";
import { cn } from "@/client/lib/utils";
import type { Professional } from "@/client/types/booking";

export interface ProfessionalSelectionViewProps {
  // Data
  professionals: Professional[];

  // State
  isLoading: boolean;
  selectedProfessionalId?: string;

  // Handlers
  onProfessionalSelect: (professional: Professional) => void;
}

export function ProfessionalSelectionView({
  professionals,
  isLoading,
  selectedProfessionalId,
  onProfessionalSelect,
}: ProfessionalSelectionViewProps) {
  const { t, locale } = useTranslation();

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t.booking.professional.title}
        </h2>
        <p className="text-muted-foreground">
          {locale === "es"
            ? "Elige quién te atenderá"
            : "Choose who will serve you"}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingSpinner fullScreen />}

      {/* Empty State */}
      {!isLoading && professionals.length === 0 && (
        <EmptyState icon={UserX} message={t.booking.professional.noStaff} />
      )}

      {/* Professionals Grid - Responsive */}
      {!isLoading && professionals.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {professionals.map((professional) => {
            const isSelected = selectedProfessionalId === professional.id;
            const isDisabled = !professional.available;

            return (
              <button
                key={professional.id}
                onClick={() =>
                  !isDisabled && onProfessionalSelect(professional)
                }
                disabled={isDisabled}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all",
                  "hover:border-primary/50 hover:bg-muted/30",
                  "active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border bg-card",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
                      <AvatarImage
                        src={professional.avatar}
                        alt={professional.name}
                      />
                      <AvatarFallback className="text-sm font-medium bg-muted">
                        {getInitials(professional.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base truncate">
                      {professional.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {professional.role}
                    </p>
                  </div>

                  {/* Selection indicator for non-selected */}
                  {!isSelected && !isDisabled && (
                    <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
