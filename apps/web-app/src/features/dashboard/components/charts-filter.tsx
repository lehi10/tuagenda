"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartsFilterProps {
  onFilterChange: (period: string) => void;
}

export function ChartsFilter({ onFilterChange }: ChartsFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("7days");

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    onFilterChange(value);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Charts Period:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedPeriod === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange("7days")}
            >
              Last 7 Days
            </Button>
            <Button
              variant={selectedPeriod === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange("30days")}
            >
              Last 30 Days
            </Button>
            <Button
              variant={selectedPeriod === "3months" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange("3months")}
            >
              Last 3 Months
            </Button>
            <Button
              variant={selectedPeriod === "6months" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange("6months")}
            >
              Last 6 Months
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange("year")}
            >
              This Year
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
