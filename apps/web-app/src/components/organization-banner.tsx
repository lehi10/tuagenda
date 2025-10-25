"use client"

import { Building2, MapPin, Users, Crown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useOrganization } from "@/contexts/organization-context"

export function OrganizationBanner() {
  const { currentOrg, isSuperAdmin } = useOrganization()

  if (!currentOrg) return null

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "pro":
        return "bg-blue-100 text-blue-700 border-blue-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Card className="border-2 border-dashed">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{currentOrg.name}</h3>
                <Badge
                  variant="outline"
                  className={getPlanColor(currentOrg.plan)}
                >
                  {currentOrg.plan.toUpperCase()}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{currentOrg.employees} employees</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{currentOrg.locations} locations</span>
                </div>
              </div>
            </div>
          </div>
          {isSuperAdmin && (
            <Badge variant="secondary" className="gap-1">
              <Crown className="h-3 w-3" />
              Super Admin View
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
