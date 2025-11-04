"use client";

import { Check, ChevronsUpDown, Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBusiness } from "@/contexts";
import { cn } from "@/lib/utils";

export function BusinessSwitcher() {
  const {
    currentBusiness,
    businesses,
    setCurrentBusiness,
    isSuperAdmin,
    loading,
  } = useBusiness();
  const [open, setOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!currentBusiness) {
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="bg-muted p-1.5 rounded">
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm text-muted-foreground">No business</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin && businesses.length <= 1) {
    // Si no es super admin y solo tiene un negocio, solo muestra el negocio actual sin selector
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="bg-primary/10 p-1.5 rounded">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">
            {currentBusiness.title}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {currentBusiness.slug}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between px-2 h-auto py-2 hover:bg-accent"
        >
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <div className="bg-primary/10 p-1.5 rounded flex-shrink-0">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 text-left overflow-hidden">
              <p className="text-sm font-medium truncate">
                {currentBusiness.title}
              </p>
              <p className="text-xs text-muted-foreground capitalize">
                {currentBusiness.slug}
              </p>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search business..." />
          <CommandList>
            <CommandEmpty>No business found.</CommandEmpty>
            <CommandGroup heading="Businesses">
              {businesses.map((business) => (
                <CommandItem
                  key={business.id}
                  value={business.title}
                  onSelect={() => {
                    setCurrentBusiness(business.id!);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        currentBusiness?.id === business.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">
                        {business.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {business.slug}
                      </p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
