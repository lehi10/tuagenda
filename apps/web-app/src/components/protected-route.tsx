"use client";

import { useAuth } from "@/contexts";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Only allows access to users with type "provider", "manager", or "admin"
 * - Redirects to /login if user is not authenticated
 * - Redirects to /profile if user is a customer
 * Shows loading state while checking authentication
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated - redirect to login
        const redirectUrl = pathname || "/dashboard";
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      } else if (user.type === "customer") {
        // User is authenticated but is a customer - redirect to client profile
        router.push("/u/profile");
      }
    }
  }, [user, loading, router, pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or is a customer
  if (!user || user.type === "customer") {
    return null;
  }

  // User is authenticated and is provider/manager/admin, render children
  return <>{children}</>;
}
