"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./auth-context";
import { listBusinesses } from "@/actions/business";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "free" | "pro" | "enterprise";
  employees: number;
  locations: number;
  userRole?: string | null;
}

interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  setCurrentOrg: (_org: Organization) => void;
  isSuperAdmin: boolean;
  isLoading: boolean;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

const STORAGE_KEY = "current-organization-id";

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [currentOrg, setCurrentOrgState] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Fetch organizations when user changes
  useEffect(() => {
    if (user) {
      fetchOrganizations();
      setIsSuperAdmin(user.type === "superadmin");
    } else {
      setOrganizations([]);
      setCurrentOrgState(null);
      setIsLoading(false);
    }
  }, [user]);

  // Load saved organization from localStorage
  useEffect(() => {
    if (organizations.length > 0 && !currentOrg) {
      const savedOrgId =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;

      if (savedOrgId) {
        const savedOrg = organizations.find((org) => org.id === savedOrgId);
        if (savedOrg) {
          setCurrentOrgState(savedOrg);
          return;
        }
      }

      // Default to first organization if no saved org
      setCurrentOrgState(organizations[0]);
    }
  }, [organizations, currentOrg]);

  const fetchOrganizations = async () => {
    try {
      setIsLoading(true);

      // Use server action instead of fetch
      const result = await listBusinesses();

      if (result.success) {
        // Transform business data to organization format
        const orgs: Organization[] = result.businesses.map((business) => ({
          id: String(business.id),
          name: business.title,
          slug: business.slug,
          logo: business.logo || undefined,
          plan: "pro" as const, // TODO: Add plan field to business table
          employees: 0, // TODO: Count from business_users
          locations: 1, // TODO: Add locations count
          userRole: undefined, // TODO: Add userRole from business_users
        }));

        setOrganizations(orgs);
      } else {
        console.error("Error fetching organizations:", result.error);
        setOrganizations([]);
      }
    } catch (error) {
      console.error("Error fetching organizations:", error);
      setOrganizations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentOrg = (org: Organization) => {
    setCurrentOrgState(org);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, org.id);
    }
  };

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  const value = {
    currentOrg,
    organizations,
    setCurrentOrg,
    isSuperAdmin,
    isLoading,
    refreshOrganizations,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
