"use client";

import { useAuth } from "@/contexts";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ClientRouteProps {
  children: React.ReactNode;
}

/**
 * ClientRoute component
 * Only allows access to users with type "customer"
 * - Redirects to /login if user is not authenticated
 * - Redirects to /dashboard if user is provider, manager, or admin
 * Shows loading state while checking authentication
 */
export function ClientRoute({ children }: ClientRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated - redirect to login
        const redirectUrl = pathname || "/u/profile";
        router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
      } else if (user.type !== "customer") {
        // User is authenticated but not a customer - redirect to dashboard
        router.push("/dashboard");
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

  // Don't render children if not authenticated or not a customer
  if (!user || user.type !== "customer") {
    return null;
  }

  // User is authenticated and is a customer, render children
  return <>{children}</>;
}
