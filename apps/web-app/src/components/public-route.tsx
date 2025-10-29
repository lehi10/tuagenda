"use client";

import { useAuth } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component
 * Redirects to dashboard (or redirect URL) if user is already authenticated
 * Useful for login/signup pages
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      // Get redirect URL from query params or default to dashboard
      const redirectUrl = searchParams.get("redirect") || "/dashboard";
      router.push(redirectUrl);
    }
  }, [user, loading, router, searchParams]);

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

  // Don't render children if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  // User is not authenticated, render children
  return <>{children}</>;
}
