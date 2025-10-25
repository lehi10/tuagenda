"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Mail, Phone } from "lucide-react";

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
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={business.avatar} alt={business.name} />
            <AvatarFallback className="text-2xl">
              {business.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="mt-2 text-muted-foreground">{business.description}</p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
              {business.phone && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Phone className="h-4 w-4" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <Mail className="h-4 w-4" />
                  <span>{business.email}</span>
                </div>
              )}
              {business.location && (
                <div className="flex items-center justify-center gap-2 md:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{business.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
