"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n"

interface Professional {
  id: string
  name: string
  role: string
  avatar: string
  available: boolean
}

interface ProfessionalSelectionProps {
  professionals: Professional[]
  onSelect: (professional: Professional) => void
  selectedProfessionalId?: string
}

export function ProfessionalSelection({
  professionals,
  onSelect,
  selectedProfessionalId,
}: ProfessionalSelectionProps) {
  const { t } = useTranslation()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.booking.professional.title}</h2>
      </div>

      {professionals.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t.booking.professional.noStaff}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={professional.avatar}
                      alt={professional.name}
                    />
                    <AvatarFallback>
                      {getInitials(professional.name)}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="mt-4 font-semibold">{professional.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {professional.role}
                  </p>

                  {professional.available ? (
                    <Badge variant="secondary" className="mt-3">
                      {t.booking.professional.available}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="mt-3">
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
  )
}
