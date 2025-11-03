"use client";

import { Building2, MapPin, Users, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBusiness } from "@/contexts";

export function OrganizationBanner() {
  const { currentBusiness, isSuperAdmin } = useBusiness();

  if (!currentBusiness) return null;

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
              <Building2 className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-semibold text-base sm:text-lg truncate">
                  {currentBusiness.title}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex-shrink-0"
                >
                  {currentBusiness.status.toUpperCase()}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{currentBusiness.city}, {currentBusiness.country}</span>
                </div>
              </div>
            </div>
          </div>
          {isSuperAdmin && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs flex-shrink-0 w-fit"
            >
              <Crown className="h-3 w-3" />
              <span className="whitespace-nowrap">Super Admin View</span>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
