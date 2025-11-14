"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/client/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/client/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartData = [
  { month: "Jan", revenue: 1200, expenses: 800 },
  { month: "Feb", revenue: 1800, expenses: 900 },
  { month: "Mar", revenue: 1500, expenses: 850 },
  { month: "Apr", revenue: 2200, expenses: 1000 },
  { month: "May", revenue: 2800, expenses: 1100 },
  { month: "Jun", revenue: 2450, expenses: 950 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#10b981",
  },
  expenses: {
    label: "Expenses",
    color: "#f59e0b",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  period: string;
}

export function RevenueChart({ period: _period }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Revenue Overview</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <ChartContainer
          config={chartConfig}
          className="h-[250px] sm:h-[300px] w-full min-w-[300px]"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-revenue)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-expenses)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="month"
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
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="revenue"
              type="monotone"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
            <Area
              dataKey="expenses"
              type="monotone"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
