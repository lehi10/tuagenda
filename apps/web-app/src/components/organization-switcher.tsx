"use client";

import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
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
import {
  useOrganization,
  type Organization,
} from "@/contexts/organization-context";
import { cn } from "@/lib/utils";

export function OrganizationSwitcher() {
  const { currentOrg, organizations, setCurrentOrg, isSuperAdmin } =
    useOrganization();
  const [open, setOpen] = useState(false);

  if (!isSuperAdmin) {
    // Si no es super admin, solo muestra la organización actual sin selector
    return (
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="bg-primary/10 p-1.5 rounded">
          <Building2 className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium truncate">{currentOrg?.name}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {currentOrg?.plan} plan
          </p>
        </div>
      </div>
    );
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "enterprise":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "pro":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

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
              <p className="text-sm font-medium truncate">{currentOrg?.name}</p>
              <p className="text-xs text-muted-foreground">
                {currentOrg?.employees} employees • {currentOrg?.locations}{" "}
                locations
              </p>
            </div>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup heading="Organizations">
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => {
                    setCurrentOrg(org);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 flex-1 overflow-hidden">
                    <Check
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        currentOrg?.id === org.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">{org.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {org.employees} employees • {org.locations} locations
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "ml-2 text-xs capitalize",
                      getPlanColor(org.plan)
                    )}
                  >
                    {org.plan}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
