"use client";

import { useState } from "react";
import { Button } from "@/client/components/ui/button";

interface ChartsFilterProps {
  onFilterChange: (period: string) => void;
}

const PERIODS = [
  { value: "7days", label: "7d" },
  { value: "30days", label: "30d" },
  { value: "3months", label: "3m" },
  { value: "6months", label: "6m" },
  { value: "year", label: "1y" },
];

export function ChartsFilter({ onFilterChange }: ChartsFilterProps) {
  const [selected, setSelected] = useState("7days");

  const handleChange = (value: string) => {
    setSelected(value);
    onFilterChange(value);
  };

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground mr-1">Period:</span>
      {PERIODS.map((p) => (
        <Button
          key={p.value}
          variant={selected === p.value ? "default" : "outline"}
          size="sm"
          onClick={() => handleChange(p.value)}
          className="h-7 px-2.5 text-xs"
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
