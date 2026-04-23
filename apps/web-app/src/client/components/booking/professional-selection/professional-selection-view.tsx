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
  professionals: Professional[];
  isLoading: boolean;
  selectedProfessionalId?: string;
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

      {/* Professionals Grid */}
      {!isLoading && professionals.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                  "w-full text-left p-4 rounded-2xl border transition-all",
                  "hover:shadow-md active:scale-[0.99]",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary shadow-md"
                    : "border-border bg-card hover:border-primary/40",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center",
                        isSelected ? "bg-primary/15" : "bg-muted"
                      )}
                    >
                      <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarImage
                          src={professional.avatar}
                          alt={professional.name}
                        />
                        <AvatarFallback className="rounded-xl text-sm font-semibold bg-transparent">
                          {getInitials(professional.name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center ring-2 ring-background">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">
                      {professional.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {professional.role}
                    </p>
                    {!professional.available && (
                      <p className="text-xs text-destructive mt-1">
                        No disponible
                      </p>
                    )}
                  </div>

                  {/* Radio circle */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && (
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    )}
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
