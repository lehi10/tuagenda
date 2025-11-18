/**
 * Loading Spinner Component
 *
 * Reusable loading spinner with different sizes and layouts.
 */

import { Loader2 } from "lucide-react";
import { cn } from "@/client/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({
  size = "md",
  className,
  fullScreen = false,
  text,
}: LoadingSpinnerProps) {
  const spinner = (
    <Loader2
      className={cn(
        sizeClasses[size],
        "animate-spin text-muted-foreground",
        className
      )}
    />
  );

  if (fullScreen) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3">
        {spinner}
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    );
  }

  return spinner;
}
