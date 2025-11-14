/**
 * User Claims (Permissions) Viewer
 *
 * Page to visualize user permissions and claims in the system.
 */

"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts";
import { getUserClaims } from "@/server/api/demo/get-user-claims.action";
import type { UserPermissionInfo } from "@/server/api/demo/get-user-claims.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Shield,
  Loader2,
} from "lucide-react";

export default function ClaimsPage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserPermissionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClaims() {
      if (!user?.id) {
        setLoading(false);
        setError("No user logged in");
        return;
      }
      try {
        const info = await getUserClaims(user);
        setUserInfo(info);
      } catch (err) {
        console.error("[ClaimsPage] Failed to load claims:", err);
        setError(err instanceof Error ? err.message : "Failed to load claims");
      } finally {
        setLoading(false);
      }
    }

    loadClaims();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {error ? "Error" : "No User Found"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              {error ||
                "Could not load user permissions. Please make sure you are logged in."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              User ID: {user?.id || "Not available"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">User Permissions Demo</h1>
        </div>
        <p className="text-muted-foreground">
          This is a proof-of-concept page showing all permissions for the
          current user.
        </p>
        <Badge variant="outline" className="text-xs">
          DEMO ONLY - Safe to delete
        </Badge>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                User ID
              </p>
              <p className="font-mono text-sm">{userInfo.userId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{userInfo.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Display Name
              </p>
              <p className="text-sm">{userInfo.displayName || "N/A"}</p>
            </div>
            {userInfo.userType && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  User Type
                </p>
                <Badge variant="secondary">{userInfo.userType}</Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Permissions */}
      {userInfo.businesses.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No businesses found for this user
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {userInfo.businesses.map((business) => (
            <Card key={business.businessId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  {business.businessName}
                </CardTitle>
                <div className="flex gap-2 mt-2">
                  {business.roles.map((role) => (
                    <Badge key={role} variant="default">
                      {role}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Business ID: {business.businessId}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Permissions Matrix</h4>

                  {/* Group permissions by resource */}
                  {Object.entries(
                    business.permissions.reduce(
                      (acc, perm) => {
                        if (!acc[perm.resource]) {
                          acc[perm.resource] = [];
                        }
                        acc[perm.resource].push(perm);
                        return acc;
                      },
                      {} as Record<string, typeof business.permissions>
                    )
                  ).map(([resource, perms]) => (
                    <div key={resource} className="border rounded-lg p-4">
                      <h5 className="font-medium mb-3 capitalize">
                        {resource}
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                        {perms.map((perm) => (
                          <div
                            key={`${perm.resource}-${perm.action}`}
                            className={`flex items-center gap-2 p-2 rounded border ${
                              perm.allowed
                                ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                                : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
                            }`}
                          >
                            {perm.allowed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                            )}
                            <span className="text-xs font-medium capitalize">
                              {perm.action}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <Card className="border-dashed">
        <CardContent className="py-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a demo page for testing and
            visualization purposes only. To remove this feature:
          </p>
          <ol className="text-sm text-muted-foreground list-decimal list-inside mt-2 space-y-1">
            <li>
              Delete:{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                apps/web-app/src/app/(private)/demo-permissions/page.tsx
              </code>
            </li>
            <li>
              Delete:{" "}
              <code className="text-xs bg-muted px-1 py-0.5 rounded">
                apps/web-app/src/actions/demo/get-user-permissions.action.ts
              </code>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
