"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  differenceInDays,
} from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/client/components/ui/button";
import { Calendar } from "@/client/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import { cn } from "@/client/lib/utils";

const MAX_RANGE_DAYS = 92; // ~3 months

export interface DateRangeFilterProps {
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  /** When true, right side corners are removed (for attached clear button) */
  active?: boolean;
}

function getLabel(range: DateRange | undefined): string {
  if (!range?.from) return "Fecha";
  if (range.to && range.to.getTime() !== range.from.getTime()) {
    return `${format(range.from, "dd MMM")} – ${format(range.to, "dd MMM")}`;
  }
  return format(range.from, "dd MMM yyyy");
}

export function DateRangeFilter({
  value,
  onChange,
  active,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);

  const now = new Date();

  const presets = [
    { label: "Hoy", range: { from: now, to: now } },
    {
      label: "Esta semana",
      range: {
        from: startOfWeek(now, { weekStartsOn: 1 }),
        to: endOfWeek(now, { weekStartsOn: 1 }),
      },
    },
    {
      label: "Este mes",
      range: { from: startOfMonth(now), to: endOfMonth(now) },
    },
  ];

  const handlePreset = (range: DateRange) => {
    setError(false);
    onChange(range);
    setOpen(false);
  };

  const handleSelect = (range: DateRange | undefined) => {
    // Reset on new first-date selection
    if (!range?.to) {
      setError(false);
      onChange(range);
      return;
    }

    const diff = Math.abs(differenceInDays(range.to, range.from!));
    if (diff > MAX_RANGE_DAYS) {
      // Reject: reset to only the start date so user picks again
      setError(true);
      onChange({ from: range.from, to: undefined });
      return;
    }

    setError(false);
    onChange(range);
    if (range.from!.getTime() !== range.to.getTime()) {
      setOpen(false);
    }
  };

  const isSelectingRange = !!value?.from && !value.to;

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setError(false);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant={active ? "default" : "outline"}
          size="sm"
          className={cn("gap-1.5 h-9", active && "rounded-r-none border-r-0")}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          {getLabel(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex gap-1 p-2 border-b">
          {presets.map((p) => (
            <Button
              key={p.label}
              variant={
                value?.from &&
                value?.to &&
                format(value.from, "yyyy-MM-dd") ===
                  format(p.range.from, "yyyy-MM-dd") &&
                format(value.to, "yyyy-MM-dd") ===
                  format(p.range.to, "yyyy-MM-dd")
                  ? "default"
                  : "ghost"
              }
              size="sm"
              className="text-xs h-7"
              onClick={() => handlePreset(p.range)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="px-3 py-2 border-t text-xs min-h-[32px]">
          {error ? (
            <span className="text-destructive font-medium">
              El rango máximo es de 3 meses. Selecciona otra fecha.
            </span>
          ) : isSelectingRange ? (
            <span className="text-muted-foreground">
              Selecciona la fecha final (máx. 3 meses)
            </span>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
