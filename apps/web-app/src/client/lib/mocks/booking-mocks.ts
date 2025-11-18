/**
 * Mock Data for Booking Flow
 *
 * TEMPORARY: This file contains mock data used during development.
 * TODO: Remove this file once real data fetching is implemented for:
 * - Professionals (should fetch from API)
 * - Business location (should come from business entity)
 */

import type { Professional, BusinessLocation } from "@/client/types/booking";

/**
 * Mock professionals data
 * TODO: Replace with tRPC query to fetch real professionals
 */
export const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: "1",
    name: "María González",
    role: "Estilista Senior",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    available: true,
  },
  {
    id: "2",
    name: "Carlos Ruiz",
    role: "Masajista",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
    available: true,
  },
  {
    id: "3",
    name: "Ana Torres",
    role: "Especialista en Uñas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
    available: true,
  },
];

/**
 * Mock business location
 * TODO: Replace with actual business location from props/API
 */
export const MOCK_BUSINESS_LOCATION: BusinessLocation = {
  address: "Av. Principal 123, Lima",
  lat: -12.0464,
  lng: -77.0428,
};
