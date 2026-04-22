"use client";

import { Calendar, Clock, DollarSign, Users, TrendingUp, TrendingDown } from "lucide-react";
import { useTranslation } from "@/client/i18n";
import { useTrpc } from "@/client/lib/trpc";
import { LucideIcon } from "lucide-react";

interface DashboardStatsProps {
  businessId: string;
  period: string;
}

function pctChange(current: number, prev: number): { label: string; up: boolean } {
  if (prev === 0) {
    const up = current > 0;
    return { label: up ? "+100%" : "0%", up };
  }
  const diff = ((current - prev) / prev) * 100;
  return { label: `${diff >= 0 ? "+" : ""}${diff.toFixed(0)}%`, up: diff >= 0 };
}

interface StatItemProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: { label: string; up: boolean };
  sub?: string;
}

function StatItem({ title, value, icon: Icon, trend, sub }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 min-w-0">
      <div className="p-2 rounded-lg bg-muted flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
        {trend && (
          <p className={`text-[10px] flex items-center gap-0.5 ${trend.up ? "text-emerald-600" : "text-red-500"}`}>
            {trend.up ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
            {trend.label} vs last period
          </p>
        )}
        {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function DashboardStats({ businessId, period }: DashboardStatsProps) {
  const { t } = useTranslation();

  const { data, isLoading } = useTrpc.analytics.getStats.useQuery(
    { businessId, period: period as "7days" | "30days" | "3months" | "6months" | "year" },
    { enabled: !!businessId }
  );

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 border rounded-xl bg-card divide-x divide-y lg:divide-y-0">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="p-3 h-[76px] animate-pulse">
            <div className="flex items-center gap-3 h-full">
              <div className="h-8 w-8 rounded-lg bg-muted flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-2.5 bg-muted rounded w-3/4" />
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="h-2 bg-muted rounded w-2/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const apptTrend = pctChange(data.totalAppointments, data.totalAppointmentsPrev);
  const clientTrend = pctChange(data.totalClients, data.totalClientsPrev);
  const revTrend = pctChange(data.totalRevenue, data.totalRevenuePrev);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 border rounded-xl bg-card divide-x divide-y lg:divide-y-0">
      <StatItem
        title={t.pages.appointments.title}
        value={String(data.totalAppointments)}
        icon={Calendar}
        trend={apptTrend}
      />
      <StatItem
        title={t.pages.appointments.upcoming}
        value={String(data.upcomingAppointments)}
        icon={Clock}
        sub="Next 7 days"
      />
      <StatItem
        title={t.pages.clients.title}
        value={String(data.totalClients)}
        icon={Users}
        trend={clientTrend}
      />
      <StatItem
        title="Revenue"
        value={`$${data.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        icon={DollarSign}
        trend={revTrend}
      />
    </div>
  );
}
