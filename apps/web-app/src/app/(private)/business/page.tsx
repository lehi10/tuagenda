"use client";

import { useTranslation } from "@/i18n";
import { BusinessList } from "@/features/business/components/business-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { BusinessFormDialog } from "@/features/business/components/business-form-dialog";

export default function BusinessPage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            {t.pages.business.title}
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            {t.pages.business.businessList}
          </p>
        </div>
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.pages.business.addBusiness}
        </Button>
      </div>

      <BusinessList />

      <BusinessFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
