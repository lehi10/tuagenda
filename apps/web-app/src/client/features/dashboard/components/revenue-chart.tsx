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
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { ChartDataPoint } from "@/server/core/domain/repositories/IAnalyticsRepository";

const chartConfig = {
  revenue: { label: "Revenue", color: "#10b981" },
} satisfies ChartConfig;

interface RevenueChartProps {
  data: ChartDataPoint[];
  isLoading?: boolean;
}

function fmt(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return `$${value.toFixed(0)}`;
}

function formatLabel(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Revenue Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const total = data.reduce((s, d) => s + d.revenue, 0);
  const avg = data.length > 0 ? total / data.length : 0;
  const best = data.reduce(
    (max, d) => (d.revenue > max.revenue ? d : max),
    data[0] ?? { label: "", revenue: 0 }
  );

  // Trend: compare first half vs second half
  const mid = Math.floor(data.length / 2);
  const firstHalf = data.slice(0, mid).reduce((s, d) => s + d.revenue, 0);
  const secondHalf = data.slice(mid).reduce((s, d) => s + d.revenue, 0);
  const trendUp = secondHalf >= firstHalf;

  const chartData = data.map((d) => ({
    label: formatLabel(d.label),
    revenue: d.revenue,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            Revenue Overview
          </CardTitle>
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              trendUp
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {trendUp ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trendUp ? "Trending up" : "Trending down"}
          </div>
        </div>

        {/* KPI summary */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xs font-semibold">{fmt(total)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-300 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Avg/day</span>
            <span className="text-xs font-semibold">{fmt(avg)}</span>
          </div>
          {best.revenue > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 flex-shrink-0" />
              <span className="text-xs text-muted-foreground">Best day</span>
              <span className="text-xs font-semibold">{fmt(best.revenue)}</span>
              <span className="text-[10px] text-muted-foreground">
                ({formatLabel(best.label)})
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto pt-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No revenue data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[180px] w-full min-w-[280px]"
          >
            <AreaChart
              data={chartData}
              margin={{ top: 4, right: 4, bottom: 0, left: -8 }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
                width={44}
                tickFormatter={(v) => fmt(v)}
              />
              {avg > 0 && (
                <ReferenceLine
                  y={avg}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 3"
                  strokeOpacity={0.5}
                  label={{
                    value: `avg ${fmt(avg)}`,
                    position: "insideTopRight",
                    fontSize: 10,
                    fill: "hsl(var(--muted-foreground))",
                  }}
                />
              )}
              <ChartTooltip
                cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const value = (payload[0]?.value as number) ?? 0;
                  const diff = value - avg;
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md space-y-1">
                      <p className="font-semibold">{label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-semibold ml-auto pl-4">
                          {fmt(value)}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] ${diff >= 0 ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {diff >= 0 ? "+" : ""}
                        {fmt(diff)} vs avg
                      </p>
                    </div>
                  );
                }}
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--color-revenue)", strokeWidth: 0 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
