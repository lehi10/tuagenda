"use client";

import { useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import { cn } from "@/client/lib/utils";

export interface GroupedComboboxOption {
  id: string;
  name: string;
}

export interface GroupedComboboxGroup {
  /** Group heading label */
  label: string;
  options: GroupedComboboxOption[];
}

export interface GroupedComboboxFilterProps {
  /** Pre-grouped options (each group has a label + options) */
  groups: GroupedComboboxGroup[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  allLabel: string;
  searchPlaceholder?: string;
  /** When true, right side corners are removed (for attached clear button) */
  active?: boolean;
}

export function GroupedComboboxFilter({
  groups,
  value,
  onChange,
  placeholder,
  allLabel,
  searchPlaceholder = "Buscar...",
  active,
}: GroupedComboboxFilterProps) {
  const [open, setOpen] = useState(false);

  const selectedName = groups
    .flatMap((g) => g.options)
    .find((o) => o.id === value)?.name;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={value !== "all" ? "default" : "outline"}
          size="sm"
          role="combobox"
          className={cn(
            "h-9 gap-1.5 min-w-[140px] justify-between font-normal",
            active && "rounded-r-none border-r-0"
          )}
        >
          <span className="truncate">
            {value !== "all" ? selectedName : placeholder}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="all"
                onSelect={() => {
                  onChange("all");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === "all" ? "opacity-100" : "opacity-0"
                  )}
                />
                {allLabel}
              </CommandItem>
            </CommandGroup>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.options.map((o) => (
                  <CommandItem
                    key={o.id}
                    value={`${o.name}-${o.id}`}
                    onSelect={() => {
                      onChange(o.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === o.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {o.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
