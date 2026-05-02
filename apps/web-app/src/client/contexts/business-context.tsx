"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./auth-context";
import { trpc } from "@/client/lib/trpc";
import type {
  Business as BusinessProps,
  BusinessUserProps,
} from "@/shared/types/business";
import { BusinessRole } from "@/shared/types/business";
import { UserType } from "@/shared/types/auth";
import { logger } from "@/shared/lib/logger";

/**
 * Business context state
 */
interface BusinessState {
  /**
   * Currently selected business
   */
  currentBusiness: BusinessProps | null;

  /**
   * Current user's relationship with the business (role, etc.)
   * Only available for regular users, null for superadmins
   */
  currentBusinessUser: BusinessUserProps | null;

  /**
   * All businesses accessible to the user
   * - For superadmins: all businesses in the system
   * - For regular users: only businesses they're associated with
   */
  businesses: BusinessProps[];

  /**
   * All business-user relationships for the current user
   * Empty array for superadmins
   */
  businessUsers: BusinessUserProps[];

  /**
   * Whether the user is a superadmin (has access to all businesses)
   */
  isSuperAdmin: boolean;

  /**
   * Whether data is being loaded
   */
  loading: boolean;

  /**
   * Error if any occurred
   */
  error: Error | null;
}

interface BusinessContextValue extends BusinessState {
  /**
   * Set the current business by ID
   */
  setCurrentBusiness: (businessId: string) => void;

  /**
   * Refresh business data
   */
  refreshBusinesses: () => Promise<void>;

  /**
   * Check if user is a manager in the current business
   * Always returns false for superadmins
   */
  isManager: () => boolean;

  /**
   * Check if user is an employee in the current business
   * Always returns false for superadmins
   */
  isEmployee: () => boolean;
}

const BusinessContext = createContext<BusinessContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "current-business-id";

/**
 * Business Provider
 *
 * Manages the current business and user's role in that business.
 * Uses TanStack Query for data fetching and caching.
 * Persists selected business to sessionStorage.
 *
 * Supports two modes:
 * - Regular users: Fetch only businesses they're associated with via business_users
 * - Superadmins: Fetch all businesses in the system
 */
export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [currentBusinessId, setCurrentBusinessId] = useState<string | null>(
    () => {
      if (typeof window !== "undefined") {
        return sessionStorage.getItem(STORAGE_KEY);
      }
      return null;
    }
  );

  const isSuperAdmin = user?.type === UserType.SUPERADMIN;

  // QUERY 1: Fetch business-user relationships (only for regular users)
  const {
    data: businessUsersData,
    isLoading: isLoadingBusinessUsers,
    error: businessUsersError,
    refetch: refetchBusinessUsers,
  } = useQuery({
    queryKey: ["business-users", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      logger.info(
        "BusinessContext",
        user.id,
        "Fetching business-user relationships"
      );

      const businessUsers = await trpc.businessUser.getByUser.query();

      logger.info(
        "BusinessContext",
        user.id,
        `Found ${businessUsers.length} business relationships`
      );

      return businessUsers;
    },
    enabled: !!user?.id && !isSuperAdmin, // Only for non-superadmins
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const businessUsers = businessUsersData || [];

  // QUERY 2: Fetch businesses
  // - For superadmins: last 10 businesses (switcher handles full search)
  // - For regular users: businesses by IDs from business-user relationships
  const {
    data: businessesData,
    isLoading: isLoadingBusinesses,
    error: businessesError,
    refetch: refetchBusinesses,
  } = useQuery({
    queryKey: isSuperAdmin
      ? ["businesses", "recent"]
      : ["businesses", businessUsers.map((bu) => bu.businessId).sort()],
    queryFn: async () => {
      if (isSuperAdmin) {
        // Superadmin: fetch last 10 to set default (switcher loads dynamically)
        logger.info(
          "BusinessContext",
          user?.id || "system",
          "Fetching recent businesses (superadmin)"
        );

        const result = await trpc.business.list.query({ limit: 10 });

        logger.info(
          "BusinessContext",
          user?.id || "system",
          `Fetched ${result.businesses.length} recent businesses (superadmin)`
        );

        return result.businesses;
      } else {
        // Regular user: fetch businesses by IDs
        if (businessUsers.length === 0) {
          return [];
        }

        const businessIds = businessUsers.map((bu) => bu.businessId);

        logger.info(
          "BusinessContext",
          user?.id || "system",
          `Fetching details for ${businessIds.length} businesses`
        );

        const businesses = await trpc.business.getByIds.query({
          ids: businessIds,
        });

        logger.info(
          "BusinessContext",
          user?.id || "system",
          `Fetched ${businesses.length} business details`
        );

        return businesses;
      }
    },
    enabled: isSuperAdmin ? !!user?.id : businessUsers.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  const loadedBusinesses: BusinessProps[] = useMemo(
    () => businessesData || [],
    [businessesData]
  );

  // For superadmins: if the saved business is not in the last 10, load it by ID
  const savedIdNotInList =
    isSuperAdmin &&
    !!currentBusinessId &&
    loadedBusinesses.length > 0 &&
    !loadedBusinesses.find((b) => b.id === currentBusinessId);

  const { data: savedBusinessData } = useQuery({
    queryKey: ["business", currentBusinessId],
    queryFn: () => trpc.business.getById.query({ id: currentBusinessId! }),
    enabled: savedIdNotInList,
    staleTime: 5 * 60 * 1000,
  });

  const businesses: BusinessProps[] = useMemo(() => {
    if (savedBusinessData && savedIdNotInList) {
      return [savedBusinessData, ...loadedBusinesses];
    }
    return loadedBusinesses;
  }, [loadedBusinesses, savedBusinessData, savedIdNotInList]);
  const isLoading = isLoadingBusinessUsers || isLoadingBusinesses;
  const error = businessUsersError || businessesError;

  // Set initial business when data loads
  useEffect(() => {
    if (businesses.length > 0 && currentBusinessId === null) {
      // Try to load from sessionStorage
      if (typeof window !== "undefined") {
        const savedId = sessionStorage.getItem(STORAGE_KEY);
        if (savedId) {
          const savedBusiness = businesses.find((b) => b.id === savedId);
          if (savedBusiness) {
            setCurrentBusinessId(savedId);
            logger.info(
              "BusinessContext",
              user?.id || "system",
              `Restored saved business: ${savedId}`
            );
            return;
          }
        }
      }

      // Default to first business
      const firstBusinessId = businesses[0].id!;
      setCurrentBusinessId(firstBusinessId);

      if (typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, String(firstBusinessId));
      }

      logger.info(
        "BusinessContext",
        user?.id || "system",
        `Set default business: ${firstBusinessId}`
      );
    }
  }, [businesses, currentBusinessId, user?.id]);

  // Clear business data when user logs out
  // Guard: only clear when auth has fully resolved (not during initial loading)
  useEffect(() => {
    if (!authLoading && !user) {
      setCurrentBusinessId(null);
      queryClient.removeQueries({ queryKey: ["business-users"] });
      queryClient.removeQueries({ queryKey: ["businesses"] });

      if (typeof window !== "undefined") {
        sessionStorage.removeItem(STORAGE_KEY);
      }

      logger.info(
        "BusinessContext",
        "system",
        "Cleared business data on logout"
      );
    }
  }, [authLoading, user, queryClient]);

  // Find current business and business-user relationship
  const currentBusinessUser = isSuperAdmin
    ? null
    : businessUsers.find((bu) => bu.businessId === currentBusinessId) || null;

  const currentBusiness =
    businesses.find((b) => b.id === currentBusinessId) || null;

  const setCurrentBusiness = (businessId: string) => {
    // For regular users, verify they have access to the business
    if (!isSuperAdmin) {
      const business = businesses.find((b) => b.id === businessId);

      if (!business) {
        logger.error(
          "BusinessContext",
          user?.id || "system",
          `Business ${businessId} not found in user's businesses`
        );
        return;
      }

      const businessUser = businessUsers.find(
        (bu) => bu.businessId === businessId
      );

      if (!businessUser) {
        logger.error(
          "BusinessContext",
          user?.id || "system",
          `Business ${businessId} not found in user's business relationships`
        );
        return;
      }
    }
    // For superadmins: skip local validation — they can switch to any business.
    // If the business isn't in the loaded list, savedIdNotInList will fetch it.

    setCurrentBusinessId(businessId);

    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, String(businessId));
    }

    // Invalidate all cached queries so components refetch data for the new business.
    // The businessId is sent via header (not query input), so React Query's cache
    // keys don't change automatically when the business switches.
    void queryClient.invalidateQueries();

    logger.info(
      "BusinessContext",
      user?.id || "system",
      `Switched to business: ${businessId}`
    );
  };

  const refreshBusinesses = async () => {
    logger.info(
      "BusinessContext",
      user?.id || "system",
      "Refreshing business data"
    );

    if (!isSuperAdmin) {
      await refetchBusinessUsers();
    }
    await refetchBusinesses();
  };

  const isManager = (): boolean => {
    if (isSuperAdmin) return false;
    return currentBusinessUser?.role === BusinessRole.MANAGER;
  };

  const isEmployee = (): boolean => {
    if (isSuperAdmin) return false;
    return currentBusinessUser?.role === BusinessRole.EMPLOYEE;
  };

  const value: BusinessContextValue = {
    currentBusiness,
    currentBusinessUser,
    businesses,
    businessUsers,
    isSuperAdmin,
    loading: isLoading,
    error: error instanceof Error ? error : null,
    setCurrentBusiness,
    refreshBusinesses,
    isManager,
    isEmployee,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

/**
 * Hook to access business context
 *
 * Usage:
 * ```tsx
 * const { currentBusiness, currentBusinessUser, isManager, isSuperAdmin } = useBusiness();
 * ```
 */
export function useBusiness(): BusinessContextValue {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
}
