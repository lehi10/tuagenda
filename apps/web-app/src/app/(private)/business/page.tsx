"use client";

import { useTranslation } from "@/i18n";
import { BusinessList } from "@/features/business/components/business-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import { BusinessFormDialog } from "@/features/business/components/business-form-dialog";
import { useOrganization } from "@/contexts/organization-context";

export default function BusinessPage() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const businessListRef = useRef<{ refresh: () => void }>(null);
  const { refreshOrganizations } = useOrganization();

  const handleCreateSuccess = async () => {
    // Trigger refresh of the business list
    if (businessListRef.current) {
      businessListRef.current.refresh();
    }
    // Also refresh the organization switcher
    await refreshOrganizations();
  };

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

      <BusinessList ref={businessListRef} />

      <BusinessFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}
