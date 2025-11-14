"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/client/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { day: "Mon", bookings: 12, completed: 10 },
  { day: "Tue", bookings: 18, completed: 15 },
  { day: "Wed", bookings: 15, completed: 13 },
  { day: "Thu", bookings: 22, completed: 20 },
  { day: "Fri", bookings: 28, completed: 25 },
  { day: "Sat", bookings: 32, completed: 30 },
  { day: "Sun", bookings: 20, completed: 18 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "#3b82f6",
  },
  completed: {
    label: "Completed",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

interface BookingsChartProps {
  period: string;
}

export function BookingsChart({ period: _period }: BookingsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Weekly Bookings</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] sm:h-[300px] w-full min-w-[300px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
              width={40}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="bookings"
              fill="var(--color-bookings)"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="completed"
              fill="var(--color-completed)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
