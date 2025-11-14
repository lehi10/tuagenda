"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Avatar, AvatarFallback } from "@/client/components/ui/avatar";
import { Progress } from "@/client/components/ui/progress";
import { Badge } from "@/client/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  initials: string;
  bookings: number;
  revenue: number;
  rating: number;
  trend: "up" | "down";
  trendValue: number;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    bookings: 45,
    revenue: 3200,
    rating: 4.9,
    trend: "up",
    trendValue: 12,
  },
  {
    id: "2",
    name: "Mike Chen",
    initials: "MC",
    bookings: 38,
    revenue: 2800,
    rating: 4.7,
    trend: "up",
    trendValue: 8,
  },
  {
    id: "3",
    name: "Emily Davis",
    initials: "ED",
    bookings: 42,
    revenue: 3100,
    rating: 4.8,
    trend: "down",
    trendValue: 3,
  },
  {
    id: "4",
    name: "James Wilson",
    initials: "JW",
    bookings: 35,
    revenue: 2500,
    rating: 4.6,
    trend: "up",
    trendValue: 15,
  },
];

interface EmployeePerformanceProps {
  period: string;
}

export function EmployeePerformance({
  period: _period,
}: EmployeePerformanceProps) {
  const maxBookings = Math.max(...employees.map((e) => e.bookings));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Employee Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          {employees.map((employee) => (
            <div key={employee.id} className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarFallback className="text-xs sm:text-sm">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {employee.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                      <span className="whitespace-nowrap">
                        {employee.bookings} bookings
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="whitespace-nowrap">
                        ${employee.revenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="gap-1 text-xs">
                    ⭐ {employee.rating}
                  </Badge>
                  <Badge
                    variant={employee.trend === "up" ? "default" : "secondary"}
                    className="gap-1 text-xs"
                  >
                    {employee.trend === "up" ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {employee.trendValue}%
                  </Badge>
                </div>
              </div>
              <Progress
                value={(employee.bookings / maxBookings) * 100}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
