"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "@/i18n"
import { Clock, DollarSign, MapPin, Video } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: string
  location: "in-person" | "virtual"
}

interface ServiceSelectionProps {
  services: Service[]
  onSelect: (service: Service) => void
  selectedServiceId?: string
}

export function ServiceSelection({
  services,
  onSelect,
  selectedServiceId,
}: ServiceSelectionProps) {
  const { t } = useTranslation()
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((service) => service.category))
  )

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesLocation =
      locationFilter === "all" || service.location === locationFilter
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter
    return matchesLocation && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{t.booking.service.title}</h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t.booking.service.filterByLocation} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.booking.service.allCategories}</SelectItem>
            <SelectItem value="in-person">
              {t.booking.service.locationInPerson}
            </SelectItem>
            <SelectItem value="virtual">
              {t.booking.service.locationVirtual}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t.booking.service.filterByCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.booking.service.allCategories}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t.booking.service.noServices}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedServiceId === service.id
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() => onSelect(service)}
            >
              <CardContent className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="font-semibold">{service.name}</h3>
                  {service.location === "virtual" ? (
                    <Video className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration} {t.booking.summary.minutes}</span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
