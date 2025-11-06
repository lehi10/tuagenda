"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";

const chartData = [
  { name: "Haircut", value: 45, fill: "#3b82f6" },
  { name: "Coloring", value: 30, fill: "#8b5cf6" },
  { name: "Manicure", value: 15, fill: "#ec4899" },
  { name: "Massage", value: 10, fill: "#14b8a6" },
];

const chartConfig = {
  value: {
    label: "Bookings",
  },
  haircut: {
    label: "Haircut",
    color: "#3b82f6",
  },
  coloring: {
    label: "Coloring",
    color: "#8b5cf6",
  },
  manicure: {
    label: "Manicure",
    color: "#ec4899",
  },
  massage: {
    label: "Massage",
    color: "#14b8a6",
  },
} satisfies ChartConfig;

interface ServicesChartProps {
  period: string;
}

export function ServicesChart({ period }: ServicesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
