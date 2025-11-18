/**
 * Empty State Component
 *
 * Reusable component for displaying empty states with optional icon.
 */

import { cn } from "@/client/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  className?: string;
  description?: string;
}

export function EmptyState({
  message,
  icon: Icon,
  className,
  description,
}: EmptyStateProps) {
  return (
    <div className={cn("py-12 text-center", className)}>
      {Icon && (
        <Icon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
      )}
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
      {description && (
        <p className="text-xs text-muted-foreground/70 mt-1">{description}</p>
      )}
    </div>
  );
}
