"use client";

import { useAuth } from "@/contexts";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute component
 * Redirects authenticated users based on their type:
 * - customer → /profile
 * - provider/manager/admin → /dashboard (or redirect URL)
 * Useful for login/signup pages
 */
export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      const redirectParam = searchParams.get("redirect");

      // Determine redirect URL based on user type
      let redirectUrl: string;
      if (user.type === "customer") {
        // Customers go to their profile page
        redirectUrl =
          redirectParam && redirectParam.startsWith("/u/profile")
            ? redirectParam
            : "/u/profile";
      } else {
        // Providers, managers, and admins go to dashboard
        redirectUrl = redirectParam || "/dashboard";
      }

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
