"use client";

import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/components/ui/dropdown-menu";
import { ScrollArea } from "@/client/components/ui/scroll-area";
import { cn } from "@/client/lib/utils";
import type { ServiceCategoryData } from "../types";

interface CategorySidebarProps {
  categories: ServiceCategoryData[];
  selectedCategoryId: string | null;
  serviceCounts: Record<string, number>;
  onSelectCategory: (categoryId: string) => void;
  onAddCategory: () => void;
  onEditCategory: (category: ServiceCategoryData) => void;
  onDeleteCategory: (category: ServiceCategoryData) => void;
  isLoading?: boolean;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  serviceCounts,
  onSelectCategory,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  isLoading,
}: CategorySidebarProps) {
  if (isLoading) {
    return (
      <div className="w-64 border-r bg-muted/30 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-9 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 border-r bg-muted/30 flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onAddCategory} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoria
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground p-2 text-center">
              No hay categorias
            </p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  selectedCategoryId === category.id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted cursor-pointer"
                )}
                onClick={() => onSelectCategory(category.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{category.name}</div>
                  <div
                    className={cn(
                      "text-xs",
                      selectedCategoryId === category.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {serviceCounts[category.id] || 0} servicios
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 opacity-0 group-hover:opacity-100",
                        selectedCategoryId === category.id &&
                          "text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20"
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCategory(category);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCategory(category);
                      }}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
