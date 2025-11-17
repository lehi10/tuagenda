"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import { MapPin, Phone, Mail, Globe, MessageCircle } from "lucide-react";

interface BusinessProfileProps {
  business: {
    name: string;
    description: string;
    avatar: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };
}

export function BusinessProfile({ business }: BusinessProfileProps) {
  const handleWhatsAppClick = () => {
    // Remove all non-numeric characters from phone
    const cleanPhone = business.phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneClick = () => {
    window.location.href = `tel:${business.phone}`;
  };

  const handleEmailClick = () => {
    window.location.href = `mailto:${business.email}`;
  };

  const handleWebsiteClick = () => {
    if (business.website) {
      const url = business.website.startsWith("http")
        ? business.website
        : `https://${business.website}`;
      window.open(url, "_blank");
    }
  };

  return (
    <div className="border-b bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 shrink-0 ring-2 ring-primary/10 sm:h-24 sm:w-24">
            <AvatarImage src={business.avatar} alt={business.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
              {business.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Business Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {business.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground sm:text-base line-clamp-2">
                {business.description}
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {business.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{business.phone}</span>
                </div>
              )}
              {business.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4" />
                  <span className="truncate max-w-[200px]">
                    {business.email}
                  </span>
                </div>
              )}
              {business.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-[250px]">
                    {business.location}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              {business.phone && (
                <>
                  <Button
                    size="sm"
                    onClick={handleWhatsAppClick}
                    className="gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePhoneClick}
                    className="gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    <span className="hidden sm:inline">Llamar</span>
                  </Button>
                </>
              )}
              {business.email && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEmailClick}
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  <span className="hidden sm:inline">Email</span>
                </Button>
              )}
              {business.website && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleWebsiteClick}
                  className="gap-2"
                >
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Sitio Web</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
