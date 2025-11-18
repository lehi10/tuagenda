"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Badge } from "@/client/components/ui/badge";
import { useTranslation } from "@/client/i18n";
import { UserX } from "lucide-react";
import { SelectableCard } from "@/client/components/booking/shared/selectable-card";
import { EmptyState } from "@/client/components/booking/shared/empty-state";
import { getInitials } from "@/client/lib/booking-utils";
import type { Professional } from "@/client/types/booking";

interface ProfessionalSelectionProps {
  professionals: Professional[];
  onSelect: (_professional: Professional) => void;
  selectedProfessionalId?: string;
}

export function ProfessionalSelection({
  professionals,
  onSelect,
  selectedProfessionalId,
}: ProfessionalSelectionProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.booking.professional.title}
        </h2>
      </div>

      {professionals.length === 0 ? (
        <EmptyState
          icon={UserX}
          message={t.booking.professional.noStaff}
        />
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {professionals.map((professional) => (
            <SelectableCard
              key={professional.id}
              isSelected={selectedProfessionalId === professional.id}
              onClick={() => professional.available && onSelect(professional)}
              disabled={!professional.available}
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-14 w-14 sm:h-16 sm:w-16">
                  <AvatarImage
                    src={professional.avatar}
                    alt={professional.name}
                  />
                  <AvatarFallback className="text-xs sm:text-sm">
                    {getInitials(professional.name)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="mt-2 font-semibold text-xs sm:text-sm line-clamp-1">
                  {professional.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {professional.role}
                </p>

                {professional.available ? (
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {t.booking.professional.available}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="mt-2 text-xs">
                    No {t.booking.professional.available.toLowerCase()}
                  </Badge>
                )}
              </div>
            </SelectableCard>
          ))}
        </div>
      )}
    </div>
  );
}
