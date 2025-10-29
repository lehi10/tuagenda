"use client";

import React, { createContext, useContext, useState } from "react";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  plan: "free" | "pro" | "enterprise";
  employees: number;
  locations: number;
}

interface OrganizationContextType {
  currentOrg: Organization | null;
  organizations: Organization[];
  setCurrentOrg: (_org: Organization) => void;
  isSuperAdmin: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

// Mock data de organizaciones
const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "Acme Inc",
    slug: "acme-inc",
    plan: "enterprise",
    employees: 12,
    locations: 3,
  },
  {
    id: "2",
    name: "Beauty Salon NYC",
    slug: "beauty-salon-nyc",
    plan: "pro",
    employees: 8,
    locations: 2,
  },
  {
    id: "3",
    name: "Spa Wellness",
    slug: "spa-wellness",
    plan: "pro",
    employees: 15,
    locations: 4,
  },
  {
    id: "4",
    name: "Quick Cuts",
    slug: "quick-cuts",
    plan: "free",
    employees: 3,
    locations: 1,
  },
  {
    id: "5",
    name: "Elite Fitness Studio",
    slug: "elite-fitness",
    plan: "pro",
    employees: 10,
    locations: 2,
  },
];

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(
    mockOrganizations[0]
  );
  const [isSuperAdmin] = useState(true); // En producción esto vendría del usuario autenticado

  const value = {
    currentOrg,
    organizations: mockOrganizations,
    setCurrentOrg,
    isSuperAdmin,
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
