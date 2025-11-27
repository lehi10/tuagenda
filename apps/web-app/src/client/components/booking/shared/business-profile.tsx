"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { Button } from "@/client/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface BusinessProfileProps {
  business: {
    name: string;
    description: string;
    avatar?: string | null;
    email: string;
    phone: string;
    location: string;
    website?: string;
  };
  collapsed?: boolean;
}

export function BusinessProfile({
  business,
  collapsed = false,
}: BusinessProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanPhone = business.phone.replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${business.phone}`;
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${business.email}`;
  };

  const handleWebsiteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (business.website) {
      const url = business.website.startsWith("http")
        ? business.website
        : `https://${business.website}`;
      window.open(url, "_blank");
    }
  };

  // Show collapsed version
  if (collapsed && !isExpanded) {
    return (
      <div className="border-b bg-background">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setIsExpanded(true)}
            className="w-full py-3 flex items-center justify-between gap-3 hover:bg-muted/50 transition-colors rounded-lg"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0 ring-1 ring-primary/10">
                <AvatarImage src={business.avatar || ""} alt={business.name} />
                <AvatarFallback className="text-sm bg-gradient-to-br from-primary/20 to-secondary/20">
                  {business.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h1 className="text-base font-semibold">{business.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {business.location}
                </p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    );
  }

  // Show expanded version
  return (
    <div className="border-b bg-gradient-to-br from-muted/30 via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
          {/* Avatar */}
          <Avatar className="h-20 w-20 shrink-0 ring-2 ring-primary/10 sm:h-24 sm:w-24">
            <AvatarImage src={business.avatar || ""} alt={business.name} />
            <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-secondary/20">
              {business.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Business Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {business.name}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base line-clamp-2">
                  {business.description}
                </p>
              </div>
              {/* Collapse button - only show if collapsed prop is true */}
              {collapsed && (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
                >
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
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
