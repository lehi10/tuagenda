"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartConfig,
} from "@/client/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  LabelList,
} from "recharts";
import { ServiceDataPoint } from "@/server/core/domain/repositories/IAnalyticsRepository";

const CHART_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
];

interface ServicesChartProps {
  data: ServiceDataPoint[];
  isLoading?: boolean;
}

const chartConfig = {} satisfies ChartConfig;

export function ServicesChart({ data, isLoading }: ServicesChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Popular Services</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Popular Services</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground py-8 text-center">No data for this period.</p>
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((sum, d) => sum + d.count, 0);

  const chartData = data.map((item, i) => ({
    name: item.name,
    count: item.count,
    pct: total > 0 ? Math.round((item.count / total) * 100) : 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // Dynamic height: 38px per bar, min 160px
  const chartHeight = Math.max(160, chartData.length * 40);

  // Truncate long service names for Y axis
  const formatName = (name: string) =>
    name.length > 18 ? name.slice(0, 16) + "…" : name;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Popular Services</CardTitle>
          <span className="text-xs text-muted-foreground">{total} bookings</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pr-2">
        <ChartContainer
          config={chartConfig}
          style={{ height: chartHeight }}
          className="w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 48, bottom: 0, left: 0 }}
          >
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={formatName}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
                    <p className="font-medium mb-1">{d.name}</p>
                    <p className="text-muted-foreground">
                      {d.count} bookings &nbsp;·&nbsp; {d.pct}%
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                className="fill-foreground"
                fontSize={11}
                formatter={(v) => {
                  const n = Number(v);
                  const pct = total > 0 ? Math.round((n / total) * 100) : 0;
                  return `${n} (${pct}%)`;
                }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
