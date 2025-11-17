"use client";

import { Check, ChevronsUpDown, Building2, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/client/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/client/components/ui/popover";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/client/components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { useBusiness } from "@/client/contexts";
import { cn } from "@/client/lib/utils";

export function BusinessSwitcher() {
  const {
    currentBusiness,
    businesses,
    setCurrentBusiness,
    isSuperAdmin,
    loading,
  } = useBusiness();
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();

  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
              <Loader2 className="size-4 animate-spin" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Loading...</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!currentBusiness) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled tooltip="No business">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
              <Building2 className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">No business</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!isSuperAdmin && businesses.length <= 1) {
    // Si no es super admin y solo tiene un negocio, solo muestra el negocio actual sin selector
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" tooltip={currentBusiness.title}>
            <Avatar className="size-8">
              <AvatarImage
                src={currentBusiness.logo || undefined}
                alt={currentBusiness.title}
              />
              <AvatarFallback className="bg-primary/10">
                <Building2 className="size-4 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                {currentBusiness.title}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {currentBusiness.slug}
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={currentBusiness.title}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarImage
                  src={currentBusiness.logo || undefined}
                  alt={currentBusiness.title}
                />
                <AvatarFallback className="bg-primary/10">
                  <Building2 className="size-4 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentBusiness.title}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentBusiness.slug}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] min-w-56 rounded-lg p-0"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <Command>
              <CommandInput placeholder="Search business..." />
              <CommandList>
                <CommandEmpty>No business found.</CommandEmpty>
                <CommandGroup>
                  {businesses.map((business) => (
                    <CommandItem
                      key={business.id}
                      value={business.title}
                      onSelect={() => {
                        setCurrentBusiness(business.id!);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentBusiness?.id === business.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <Avatar className="mr-2 h-6 w-6">
                        <AvatarImage
                          src={business.logo || undefined}
                          alt={business.title}
                        />
                        <AvatarFallback className="bg-primary/10 text-xs">
                          <Building2 className="h-3 w-3 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">
                          {business.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {business.slug}
                        </p>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
