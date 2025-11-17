"use client";

import { useTrpc } from "@/client/lib/trpc";
import { useAuth } from "@/client/contexts/auth-context";

/**
 * Example component showing how to use tRPC getUser procedure
 * Token is sent automatically in headers (like Axios interceptor)
 */
export function TRPCUserExample() {
  const { user: firebaseUser } = useAuth();

  // Query user data using tRPC
  // Token is automatically included in Authorization header
  // Using namespaced router: useTrpc.user.me
  const {
    data: user,
    isLoading,
    error,
  } = useTrpc.user.me.useQuery(undefined, {
    // Only fetch when we have a Firebase user
    enabled: !!firebaseUser,
  });

  if (!firebaseUser) {
    return <div>Not authenticated</div>;
  }

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold mb-2">User Profile (via tRPC)</h3>
      <dl className="space-y-1">
        <div>
          <dt className="text-sm text-muted-foreground">Name</dt>
          <dd>
            {user.firstName} {user.lastName}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Status</dt>
          <dd>{user.status}</dd>
        </div>
        <div>
          <dt className="text-sm text-muted-foreground">Type</dt>
          <dd>{user.type}</dd>
        </div>
      </dl>
    </div>
  );
}
