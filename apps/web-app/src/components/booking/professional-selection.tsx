"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/i18n";

interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  available: boolean;
}

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.booking.professional.title}
        </h2>
      </div>

      {professionals.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {t.booking.professional.noStaff}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {professionals.map((professional) => (
            <Card
              key={professional.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedProfessionalId === professional.id
                  ? "ring-2 ring-primary"
                  : ""
              } ${!professional.available ? "opacity-60" : ""}`}
              onClick={() => professional.available && onSelect(professional)}
            >
              <CardContent className="p-3 sm:p-4">
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
