"use client";

import { Users, UserPlus, TrendingUp } from "lucide-react";
import { StatCard, StatsGrid } from "@/client/components/shared/stat-card";
import { useTrpc } from "@/client/lib/trpc";

export function ClientStats() {
  const { data, isLoading } = useTrpc.clients.getStats.useQuery();

  return (
    <StatsGrid cols={3}>
      <StatCard
        title="Total Clients"
        value={isLoading ? "—" : String(data?.total ?? 0)}
        icon={Users}
        description="All registered clients"
      />
      <StatCard
        title="New This Month"
        value={isLoading ? "—" : String(data?.newThisMonth ?? 0)}
        icon={UserPlus}
        description="First visit this month"
      />
      <StatCard
        title="Retention Rate"
        value={isLoading ? "—" : `${data?.retentionRate ?? 0}%`}
        icon={TrendingUp}
        description="Clients with more than one visit"
      />
    </StatsGrid>
  );
}
