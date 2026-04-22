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
import { EmployeeDataPoint } from "@/server/core/domain/repositories/IAnalyticsRepository";

interface EmployeePerformanceProps {
  data: EmployeeDataPoint[];
  isLoading?: boolean;
}

export function EmployeePerformance({
  data,
  isLoading,
}: EmployeePerformanceProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Employee Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-9 animate-pulse bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Employee Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No data for this period.
          </p>
        </CardContent>
      </Card>
    );
  }

  const maxBookings = Math.max(...data.map((e) => e.bookings));

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">
          Employee Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((employee) => {
            const trendValue =
              employee.bookingsPrev === 0
                ? employee.bookings > 0
                  ? 100
                  : 0
                : Math.abs(
                    Math.round(
                      ((employee.bookings - employee.bookingsPrev) /
                        employee.bookingsPrev) *
                        100
                    )
                  );
            const trend: "up" | "down" =
              employee.bookings >= employee.bookingsPrev ? "up" : "down";

            return (
              <div key={employee.id} className="space-y-1">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 flex-shrink-0">
                    <AvatarFallback className="text-[10px] font-semibold">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate leading-tight">
                      {employee.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {employee.bookings} bookings · $
                      {employee.revenue.toLocaleString()}
                    </p>
                  </div>
                  <Badge
                    variant={trend === "up" ? "default" : "secondary"}
                    className="gap-0.5 text-[10px] px-1.5 py-0 flex-shrink-0"
                  >
                    {trend === "up" ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {trendValue}%
                  </Badge>
                </div>
                <Progress
                  value={
                    maxBookings > 0
                      ? (employee.bookings / maxBookings) * 100
                      : 0
                  }
                  className="h-1.5"
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
