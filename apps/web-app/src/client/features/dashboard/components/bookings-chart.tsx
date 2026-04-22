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
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { BookingDataPoint } from "@/server/core/domain/repositories/IAnalyticsRepository";

const chartConfig = {
  completed: { label: "Completed", color: "#3b82f6" },
  pending: { label: "Pending", color: "#94a3b8" },
  cancelled: { label: "Cancelled", color: "#f87171" },
} satisfies ChartConfig;

interface BookingsChartProps {
  data: BookingDataPoint[];
  isLoading?: boolean;
}

function formatLabel(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function BookingsChart({ data, isLoading }: BookingsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Bookings</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[220px] animate-pulse bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  const totalBookings = data.reduce((s, d) => s + d.total, 0);
  const totalCompleted = data.reduce((s, d) => s + d.completed, 0);
  const totalCancelled = data.reduce((s, d) => s + d.cancelled, 0);
  const totalPending = totalBookings - totalCompleted - totalCancelled;
  const completionRate =
    totalBookings > 0 ? Math.round((totalCompleted / totalBookings) * 100) : 0;

  const chartData = data.map((d) => ({
    label: formatLabel(d.label),
    completed: d.completed,
    cancelled: d.cancelled,
    pending: d.total - d.completed - d.cancelled,
    total: d.total,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Bookings</CardTitle>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              completionRate >= 70
                ? "bg-blue-100 text-blue-700"
                : completionRate >= 40
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-600"
            }`}
          >
            {completionRate}% completed
          </span>
        </div>

        {/* KPI summary */}
        <div className="flex items-center gap-4 mt-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-400 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-xs font-semibold">{totalBookings}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Completed</span>
            <span className="text-xs font-semibold">{totalCompleted}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-slate-300 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Pending</span>
            <span className="text-xs font-semibold">{totalPending}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0" />
            <span className="text-xs text-muted-foreground">Cancelled</span>
            <span className="text-xs font-semibold">{totalCancelled}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto pt-0">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No data for this period.
          </p>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-[180px] w-full min-w-[280px]"
          >
            <BarChart
              data={chartData}
              margin={{ top: 0, right: 4, bottom: 0, left: -20 }}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
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
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const completed = payload.find((p) => p.dataKey === "completed")?.value as number ?? 0;
                  const pending = payload.find((p) => p.dataKey === "pending")?.value as number ?? 0;
                  const cancelled = payload.find((p) => p.dataKey === "cancelled")?.value as number ?? 0;
                  const total = completed + pending + cancelled;
                  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
                  return (
                    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md space-y-1">
                      <p className="font-semibold">{label}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-500" />
                        <span className="text-muted-foreground">Completed</span>
                        <span className="font-medium ml-auto pl-4">{completed}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                        <span className="text-muted-foreground">Pending</span>
                        <span className="font-medium ml-auto pl-4">{pending}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        <span className="text-muted-foreground">Cancelled</span>
                        <span className="font-medium ml-auto pl-4">{cancelled}</span>
                      </div>
                      <div className="border-t pt-1 flex justify-between text-muted-foreground">
                        <span>Total</span>
                        <span className="font-semibold text-foreground">{total} &nbsp;·&nbsp; {rate}%</span>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="var(--color-completed)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="pending"
                stackId="a"
                fill="var(--color-pending)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="cancelled"
                stackId="a"
                fill="var(--color-cancelled)"
                radius={[4, 4, 0, 0]}
              />
              <Legend
                iconType="circle"
                iconSize={7}
                wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
