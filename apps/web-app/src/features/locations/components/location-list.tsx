"use client";

import { MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/i18n";

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  employees: number;
  status: "active" | "inactive";
}

export function LocationList() {
  const { t } = useTranslation();

  const locations: Location[] = [
    {
      id: "1",
      name: "Downtown Branch",
      address: "123 Main St, New York, NY 10001",
      phone: "(555) 123-4567",
      employees: 8,
      status: "active",
    },
    {
      id: "2",
      name: "Uptown Branch",
      address: "456 Park Ave, New York, NY 10002",
      phone: "(555) 987-6543",
      employees: 6,
      status: "active",
    },
    {
      id: "3",
      name: "Westside Branch",
      address: "789 West St, New York, NY 10003",
      phone: "(555) 456-7890",
      employees: 4,
      status: "inactive",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {locations.map((location) => (
        <Card key={location.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{location.name}</h3>
                  <Badge
                    variant={
                      location.status === "active" ? "default" : "outline"
                    }
                    className="mt-1"
                  >
                    {location.status}
                  </Badge>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{t.common.edit}</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    {t.common.delete}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{location.address}</p>
              <p>{location.phone}</p>
              <p className="font-medium text-foreground">
                {location.employees} employees
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
