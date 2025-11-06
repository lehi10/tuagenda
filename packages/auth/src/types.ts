/**
 * Authorization Types
 */

export enum Resource {
  BUSINESS = "business",
  EMPLOYEE = "employee",
  APPOINTMENT = "appointment",
  SETTINGS = "settings",
}

export enum Action {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  MANAGE = "manage", // Full control
}

export enum Role {
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export enum UserType {
  SUPERADMIN = "superadmin",
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface AuthorizationRequest {
  userId: string;
  businessId: string;
  resource: Resource | string;
  action: Action | string;
}

export interface PolicyRule {
  role: Role;
  businessId: string;
  resource: Resource | string;
  action: Action | string;
}
