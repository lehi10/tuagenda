"use client";

import { useEffect } from "react";
import { Users, UserPlus, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { StatCard, StatsGrid } from "@/client/components/shared/stat-card";
import { useTrpc } from "@/client/lib/trpc";
import { useTranslation } from "@/client/i18n";

export function ClientStats() {
  const { t } = useTranslation();
  const c = t.pages.clients;

  const { data, isLoading, error } = useTrpc.clients.getStats.useQuery();

  useEffect(() => {
    if (error) toast.error(c.errorLoadingStats);
  }, [error, c.errorLoadingStats]);

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
