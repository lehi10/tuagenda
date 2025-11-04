/**
 * Protected Section Component
 *
 * Wrapper component that only renders children if the user has the required permission.
 * Shows a loading state while checking permissions and an optional fallback for denied access.
 */

import React from "react";
import { usePermission } from "@/hooks/usePermission";
import { Resource, Action } from "auth";
import { Loader2 } from "lucide-react";

interface ProtectedSectionProps {
  businessId: string | number;
  resource: Resource;
  action: Action;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProtectedSection({
  businessId,
  resource,
  action,
  children,
  fallback = null,
  loadingComponent,
}: ProtectedSectionProps) {
  const { allowed, loading } = usePermission({
    businessId,
    resource,
    action,
  });

  if (loading) {
    return (
      <>
        {loadingComponent || (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </>
    );
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
