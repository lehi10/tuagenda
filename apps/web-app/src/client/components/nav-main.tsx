"use client";

import { ChevronRight, type LucideIcon, AlertCircle } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/client/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/client/components/ui/sidebar";
import Link from "next/link";
import { useTranslation } from "@/client/i18n";

export function NavMain({
  sections,
  disabled = false,
  disabledMessage,
}: {
  sections: {
    title: string;
    items: {
      id: string;
      title: string;
      url: string;
      icon: LucideIcon;
      isActive?: boolean;
      items?: {
        id?: string;
        title: string;
        url: string;
      }[];
    }[];
  }[];
  disabled?: boolean;
  disabledMessage?: string;
}) {
  const { t } = useTranslation();
  const { state } = useSidebar();

  // If disabled, show message instead of navigation items
  if (disabled) {
    const message = disabledMessage || t.common.noOrganizationMessage;
    const isCollapsed = state === "collapsed";

    return (
      <SidebarGroup>
        <SidebarGroupLabel>{t.common.noOrganizationSelected}</SidebarGroupLabel>
        <div className="px-2">
          <div
            className="flex items-start gap-2 rounded-md px-2 py-2 text-sm opacity-50 cursor-not-allowed group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
            title={isCollapsed ? message : undefined}
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span className="text-xs text-muted-foreground leading-relaxed group-data-[collapsible=icon]:hidden">
              {message}
            </span>
          </div>
        </div>
      </SidebarGroup>
    );
  }

  return (
    <>
      {sections.map((section, index) => (
        <SidebarGroup key={index}>
          <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
          <SidebarMenu>
            {section.items.map((item) => (
              <Collapsible key={item.id} asChild defaultOpen={item.isActive}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.id || subItem.url}>
                              <SidebarMenuSubButton asChild>
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
