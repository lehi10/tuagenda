"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import { cn } from "@/client/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFilterProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  placeholder?: string;
  /** When true, right side corners are removed (for attached clear button) */
  active?: boolean;
  className?: string;
}

export function SelectFilter({
  options,
  value,
  onChange,
  allLabel,
  placeholder,
  active,
  className,
}: SelectFilterProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-9",
          active
            ? "w-[140px] rounded-r-none border-r-0 bg-primary text-primary-foreground hover:bg-primary/90 border-primary dark:bg-primary dark:hover:bg-primary/90 [&_svg:not([class*='text-'])]:text-primary-foreground"
            : "w-[150px]",
          className
        )}
      >
        <SelectValue placeholder={placeholder ?? allLabel} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
