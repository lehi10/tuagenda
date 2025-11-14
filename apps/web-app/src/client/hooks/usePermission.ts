/**
 * Permission Hook
 *
 * React hook for checking user permissions in components.
 * Provides a convenient way to check if the current user
 * can perform specific actions on resources.
 */

import { useState, useEffect, useCallback } from "react";
import { checkPermission } from "@/server/api/authorization/check-permission.action";
import { Resource, Action } from "auth";

interface UsePermissionOptions {
  businessId: string | number;
  resource: Resource;
  action: Action;
  userId?: string;
}

interface UsePermissionResult {
  allowed: boolean;
  loading: boolean;
  error?: string;
  refresh: () => Promise<void>;
}

/**
 * Hook to check user permissions
 * @param options - Permission check options
 * @returns Permission result with loading state
 */
export function usePermission(
  options: UsePermissionOptions
): UsePermissionResult {
  const [allowed, setAllowed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const checkPermissionAsync = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const result = await checkPermission({
        businessId: options.businessId,
        resource: options.resource,
        action: options.action,
        userId: options.userId,
      });

      setAllowed(result.allowed);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      console.error("Error checking permission:", err);
      setAllowed(false);
      setError("Failed to check permission");
    } finally {
      setLoading(false);
    }
  }, [options.businessId, options.resource, options.action, options.userId]);

  useEffect(() => {
    checkPermissionAsync();
  }, [checkPermissionAsync]);

  return {
    allowed,
    loading,
    error,
    refresh: checkPermissionAsync,
  };
}

/**
 * Hook to check multiple permissions at once
 * @param permissions - Array of permission options
 * @returns Map of permission results
 */
export function usePermissions(
  permissions: Array<UsePermissionOptions & { key: string }>
): Map<string, UsePermissionResult> {
  const [results, setResults] = useState<Map<string, UsePermissionResult>>(
    new Map()
  );

  useEffect(() => {
    const newResults = new Map<string, UsePermissionResult>();

    permissions.forEach((permission) => {
      // Use individual permission hook for each permission
      // This is a simplified implementation - in production you might want to batch these
      newResults.set(permission.key, {
        allowed: false,
        loading: true,
        refresh: async () => {},
      });
    });

    setResults(newResults);

    // Check all permissions
    Promise.all(
      permissions.map(async (permission) => {
        const result = await checkPermission({
          businessId: permission.businessId,
          resource: permission.resource,
          action: permission.action,
          userId: permission.userId,
        });

        return { key: permission.key, result };
      })
    ).then((permissionResults) => {
      const finalResults = new Map<string, UsePermissionResult>();

      permissionResults.forEach(({ key, result }) => {
        finalResults.set(key, {
          allowed: result.allowed,
          loading: false,
          error: result.error,
          refresh: async () => {
            // Refresh logic would go here
          },
        });
      });

      setResults(finalResults);
    });
  }, [permissions]);

  return results;
}
