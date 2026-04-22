"use client";

import { Building2, MapPin, Crown } from "lucide-react";
import { Badge } from "@/client/components/ui/badge";
import { useBusiness } from "@/client/contexts";

export function BusinessBanner() {
  const { currentBusiness, isSuperAdmin } = useBusiness();

  if (!currentBusiness) return null;

  return (
    <div className="flex items-center gap-2 text-sm flex-wrap">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
      <span className="font-medium truncate">{currentBusiness.title}</span>
      {currentBusiness.city && (
        <>
          <span className="text-muted-foreground">·</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {currentBusiness.city}
            {currentBusiness.country ? `, ${currentBusiness.country}` : ""}
          </span>
        </>
      )}
      {currentBusiness?.status && (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0"
        >
          {currentBusiness.status.toUpperCase()}
        </Badge>
      )}
      {isSuperAdmin && (
        <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0">
          <Crown className="h-2.5 w-2.5" />
          Super Admin
        </Badge>
      )}
    </div>
  );
}
