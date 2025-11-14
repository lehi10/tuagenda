/**
 * Users Page Constants
 *
 * Centralized configuration for user types and statuses
 */

import { UserType, UserStatus } from "@/server/core/domain/entities/User";

// User Type Configuration
export const USER_TYPE_CONFIG = {
  [UserType.SUPERADMIN]: {
    label: "Super Admin",
    variant: "destructive" as const,
  },
  [UserType.ADMIN]: {
    label: "Admin",
    variant: "default" as const,
  },
  [UserType.CUSTOMER]: {
    label: "Customer",
    variant: "secondary" as const,
  },
} as const;

// User Status Configuration
export const USER_STATUS_CONFIG = {
  [UserStatus.VISIBLE]: {
    label: "Visible",
    variant: "default" as const,
  },
  [UserStatus.HIDDEN]: {
    label: "Hidden",
    variant: "secondary" as const,
  },
  [UserStatus.DISABLED]: {
    label: "Disabled",
    variant: "secondary" as const,
  },
  [UserStatus.BLOCKED]: {
    label: "Blocked",
    variant: "destructive" as const,
  },
} as const;

// Filter Options
export const USER_TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  {
    value: UserType.SUPERADMIN,
    label: USER_TYPE_CONFIG[UserType.SUPERADMIN].label,
  },
  { value: UserType.ADMIN, label: USER_TYPE_CONFIG[UserType.ADMIN].label },
  {
    value: UserType.CUSTOMER,
    label: USER_TYPE_CONFIG[UserType.CUSTOMER].label,
  },
] as const;

export const USER_STATUS_FILTERS = [
  { value: "all", label: "All Status" },
  {
    value: UserStatus.VISIBLE,
    label: USER_STATUS_CONFIG[UserStatus.VISIBLE].label,
  },
  {
    value: UserStatus.HIDDEN,
    label: USER_STATUS_CONFIG[UserStatus.HIDDEN].label,
  },
  {
    value: UserStatus.DISABLED,
    label: USER_STATUS_CONFIG[UserStatus.DISABLED].label,
  },
  {
    value: UserStatus.BLOCKED,
    label: USER_STATUS_CONFIG[UserStatus.BLOCKED].label,
  },
] as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 100;
