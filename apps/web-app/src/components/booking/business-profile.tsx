"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Phone } from "lucide-react";

interface BusinessProfileProps {
  business: {
    name: string;
    description: string;
    avatar: string;
    email: string;
    phone: string;
    location: string;
  };
}

export function BusinessProfile({ business }: BusinessProfileProps) {
  return (
    <div className="border-b bg-card/50">
      <div className="container mx-auto px-4 py-4 sm:py-5">
        <div className="flex items-center gap-3 sm:gap-4">
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 shrink-0">
            <AvatarImage src={business.avatar} alt={business.name} />
            <AvatarFallback className="text-lg">
              {business.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold sm:text-xl truncate">
              {business.name}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1 sm:text-sm">
              {business.description}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:gap-x-4">
              {business.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span className="truncate">{business.phone}</span>
                </div>
              )}
              {business.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{business.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
