/**
 * Selectable Card Component
 *
 * Reusable card component for selection UI patterns.
 * Used in service selection, professional selection, payment methods, etc.
 */

import { Card, CardContent } from "@/client/components/ui/card";
import { cn } from "@/client/lib/utils";
import { Check } from "lucide-react";

interface SelectableCardProps {
  isSelected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  showCheckmark?: boolean;
}

export function SelectableCard({
  isSelected,
  onClick,
  children,
  className,
  contentClassName,
  disabled = false,
  showCheckmark = false,
}: SelectableCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md relative",
        isSelected && "ring-2 ring-primary",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={() => !disabled && onClick()}
    >
      {showCheckmark && isSelected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="h-3 w-3 text-primary-foreground" />
        </div>
      )}
      <CardContent className={cn("p-3 sm:p-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
