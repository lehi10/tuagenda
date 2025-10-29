"use client";

import { useAuth } from "@/contexts";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component
 * Redirects to /login if user is not authenticated
 * Shows loading state while checking authentication
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store the attempted URL to redirect back after login
      const redirectUrl = pathname || "/dashboard";
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
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

  // Don't render children if not authenticated
  if (!user) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
}
