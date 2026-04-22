import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: { label: string; up: boolean };
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 min-w-0">
      <div className="p-2 rounded-lg bg-muted flex-shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground truncate">{title}</p>
        <p className="text-xl font-bold leading-tight">{value}</p>
        {trend && (
          <p
            className={`text-[10px] flex items-center gap-0.5 ${trend.up ? "text-emerald-600" : "text-red-500"}`}
          >
            {trend.up ? (
              <TrendingUp className="h-2.5 w-2.5" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5" />
            )}
            {trend.label}
          </p>
        )}
        {description && !trend && (
          <p className="text-[10px] text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

interface StatsGridProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}

export function StatsGrid({ children, cols = 4 }: StatsGridProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  }[cols];

  return (
    <div
      className={`grid ${colClass} border rounded-xl bg-card divide-x divide-y lg:divide-y-0`}
    >
      {children}
    </div>
  );
}
