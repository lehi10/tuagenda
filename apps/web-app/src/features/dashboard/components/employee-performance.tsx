"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
        <CardTitle>Employee Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {employees.map((employee) => (
            <div key={employee.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{employee.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{employee.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{employee.bookings} bookings</span>
                      <span>•</span>
                      <span>${employee.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="gap-1">
                    ⭐ {employee.rating}
                  </Badge>
                  <Badge
                    variant={employee.trend === "up" ? "default" : "secondary"}
                    className="gap-1"
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
