/**
 * Info Display Item Component
 *
 * Reusable component for displaying information with an icon.
 * Used in confirmation step and other summary views.
 */

import { LucideIcon } from "lucide-react";

interface InfoDisplayItemProps {
  icon: LucideIcon;
  label?: string;
  value: React.ReactNode;
  subValue?: string;
  className?: string;
}

export function InfoDisplayItem({
  icon: Icon,
  label,
  value,
  subValue,
  className,
}: InfoDisplayItemProps) {
  return (
    <div className={`flex items-start gap-3 ${className || ""}`}>
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1">
        {label && (
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        )}
        <p className="font-medium text-sm">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-0.5">{subValue}</p>
        )}
      </div>
    </div>
  );
}
