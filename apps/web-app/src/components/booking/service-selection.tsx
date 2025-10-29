"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import { Clock, DollarSign, MapPin, Video } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  category: string;
  location: "in-person" | "virtual";
}

interface ServiceSelectionProps {
  services: Service[];
  onSelect: (_service: Service) => void;
  selectedServiceId?: string;
}

export function ServiceSelection({
  services,
  onSelect,
  selectedServiceId,
}: ServiceSelectionProps) {
  const { t } = useTranslation();
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Get unique categories
  const categories = Array.from(
    new Set(services.map((service) => service.category))
  );

  // Filter services
  const filteredServices = services.filter((service) => {
    const matchesLocation =
      locationFilter === "all" || service.location === locationFilter;
    const matchesCategory =
      categoryFilter === "all" || service.category === categoryFilter;
    return matchesLocation && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold sm:text-2xl">
          {t.booking.service.title}
        </h2>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t.booking.service.filterByLocation} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t.booking.service.allCategories}
            </SelectItem>
            <SelectItem value="in-person">
              {t.booking.service.locationInPerson}
            </SelectItem>
            <SelectItem value="virtual">
              {t.booking.service.locationVirtual}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t.booking.service.filterByCategory} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {t.booking.service.allCategories}
            </SelectItem>
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
        <div className="py-8 text-center text-sm text-muted-foreground">
          {t.booking.service.noServices}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedServiceId === service.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onSelect(service)}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm sm:text-base line-clamp-1">
                    {service.name}
                  </h3>
                  {service.location === "virtual" ? (
                    <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </div>

                <p className="mb-3 text-xs text-muted-foreground line-clamp-2">
                  {service.description}
                </p>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>
                      {service.duration} {t.booking.summary.minutes}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-semibold">
                    <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{service.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
