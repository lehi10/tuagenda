/**
 * User Permissions Viewer (Enhanced)
 *
 * Interactive page to visualize and monitor user permissions in real-time.
 * Supports filtering by business and automatic refresh.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/client/contexts";
import { getUserClaims } from "@/server/api/demo/get-user-claims.action";
import type { UserPermissionInfo } from "@/server/api/demo/get-user-claims.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/client/components/ui/card";
import { Badge } from "@/client/components/ui/badge";
import { Button } from "@/client/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/client/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/client/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  User,
  Building2,
  Shield,
  Loader2,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function PermissionsPage() {
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserPermissionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadClaims = useCallback(
    async (isRefresh = false) => {
      if (!user?.id) {
        setLoading(false);
        setError("No user logged in");
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      try {
        const info = await getUserClaims(user);
        setUserInfo(info);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("[PermissionsPage] Failed to load claims:", err);
        setError(err instanceof Error ? err.message : "Failed to load claims");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const handleRefresh = () => {
    loadClaims(true);
  };

  // Calculate permission stats
  const getPermissionStats = (businessId?: string) => {
    if (!userInfo) return { allowed: 0, denied: 0, total: 0 };

    const businesses =
      businessId && businessId !== "all"
        ? userInfo.businesses.filter((b) => b.businessId === businessId)
        : userInfo.businesses;

    const allPermissions = businesses.flatMap((b) => b.permissions);
    const allowed = allPermissions.filter((p) => p.allowed).length;
    const denied = allPermissions.filter((p) => !p.allowed).length;

    return {
      allowed,
      denied,
      total: allowed + denied,
    };
  };

  const stats = getPermissionStats(selectedBusinessId);

  const filteredBusinesses =
    selectedBusinessId === "all"
      ? userInfo?.businesses || []
      : (userInfo?.businesses || []).filter(
          (b) => b.businessId === selectedBusinessId
        );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading permissions...</p>
        </div>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="p-6">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              {error ? "Error Loading Permissions" : "No User Found"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {error ||
                "Could not load user permissions. Please make sure you are logged in."}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              User ID: {user?.id || "Not available"}
            </p>
            <Button onClick={() => loadClaims()} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Permission Viewer</h1>
            </div>
            <p className="text-muted-foreground">
              Monitor and track user permissions across all businesses
            </p>
          </div>
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  User ID
                </p>
                <p className="font-mono text-sm break-all">{userInfo.userId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Email
                </p>
                <p className="text-sm">{userInfo.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  User Type
                </p>
                {userInfo.userType ? (
                  <Badge variant="secondary" className="uppercase">
                    {userInfo.userType}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Customer
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Businesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInfo.businesses.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">
                Allowed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.allowed}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">
                Denied
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.denied}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Business Filter */}
        {userInfo.businesses.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Filter by Business</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedBusinessId}
                onValueChange={setSelectedBusinessId}
              >
                <SelectTrigger className="w-full md:w-[300px]">
                  <SelectValue placeholder="Select a business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  {userInfo.businesses.map((business) => (
                    <SelectItem
                      key={business.businessId}
                      value={business.businessId}
                    >
                      {business.businessName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        )}

        {/* Permissions by Business */}
        {filteredBusinesses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No businesses found for this user
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Create a business to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredBusinesses.map((business) => {
              const businessStats = {
                allowed: business.permissions.filter((p) => p.allowed).length,
                denied: business.permissions.filter((p) => !p.allowed).length,
              };

              return (
                <Card key={business.businessId}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="h-5 w-5" />
                          {business.businessName}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">
                          ID: {business.businessId}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {business.roles.map((role) => (
                          <Badge key={role} variant="default">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-muted-foreground">
                          {businessStats.allowed} allowed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-muted-foreground">
                          {businessStats.denied} denied
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs
                      defaultValue={
                        Object.keys(
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
                        )[0]
                      }
                      className="w-full"
                    >
                      <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
                        {Object.keys(
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
                        ).map((resource) => (
                          <TabsTrigger
                            key={resource}
                            value={resource}
                            className="capitalize"
                          >
                            {resource}
                          </TabsTrigger>
                        ))}
                      </TabsList>
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
                        <TabsContent
                          key={resource}
                          value={resource}
                          className="mt-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                            {perms.map((perm) => (
                              <div
                                key={`${perm.resource}-${perm.action}`}
                                className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                                  perm.allowed
                                    ? "bg-green-50 border-green-300 dark:bg-green-950/30 dark:border-green-700 hover:border-green-400"
                                    : "bg-red-50 border-red-300 dark:bg-red-950/30 dark:border-red-700 hover:border-red-400"
                                }`}
                              >
                                {perm.allowed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                                )}
                                <span className="text-sm font-medium capitalize">
                                  {perm.action}
                                </span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Info Card */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              About This Page
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              This page shows all permissions for the current user using Casbin
              RBAC system.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Green badges indicate permissions that are{" "}
                <strong>allowed</strong>
              </li>
              <li>
                Red badges indicate permissions that are <strong>denied</strong>
              </li>
              <li>
                Click <strong>Refresh</strong> to reload permissions after
                making changes
              </li>
              <li>
                Permissions are scoped per business and role (MANAGER or
                EMPLOYEE)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
