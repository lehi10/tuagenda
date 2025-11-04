/**
 * Authorization Service
 *
 * Central service for handling authorization using Casbin.
 * Provides methods to check permissions, manage roles, and policies.
 */

import { newEnforcer, Enforcer } from "casbin";
import { PrismaClient } from "db";
import path from "path";
import { PrismaAdapter } from "./casbin/prisma-adapter";
import {
  AuthorizationRequest,
  PolicyRule,
  Role,
  UserType,
  Resource,
  Action,
} from "./types";

export class AuthorizationService {
  private static instance: AuthorizationService;
  private enforcer: Enforcer | null = null;
  private prisma: PrismaClient;

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(prisma: PrismaClient): AuthorizationService {
    if (!AuthorizationService.instance) {
      AuthorizationService.instance = new AuthorizationService(prisma);
    }
    return AuthorizationService.instance;
  }

  /**
   * Initialize the enforcer with model and adapter
   */
  private async getEnforcer(): Promise<Enforcer> {
    if (!this.enforcer) {
      const modelPath = path.join(__dirname, "casbin", "model.conf");
      const adapter = new PrismaAdapter(this.prisma);
      this.enforcer = await newEnforcer(modelPath, adapter);
    }
    return this.enforcer;
  }

  /**
   * Check if user has permission to perform action on resource in business
   */
  async can(request: AuthorizationRequest): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    const { userId, businessId, resource, action } = request;

    // Check permission: enforce(sub, dom, obj, act)
    return enforcer.enforce(userId, businessId, resource, action);
  }

  /**
   * Assign role to user in a business domain
   */
  async assignRole(
    userId: string,
    role: Role,
    businessId: string
  ): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    // Add grouping policy: g, user, role, domain
    const added = await enforcer.addGroupingPolicy(userId, role, businessId);

    if (added) {
      await enforcer.savePolicy();
    }

    return added;
  }

  /**
   * Remove role from user in a business domain
   */
  async removeRole(
    userId: string,
    role: Role,
    businessId: string
  ): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    const removed = await enforcer.removeGroupingPolicy(userId, role, businessId);

    if (removed) {
      await enforcer.savePolicy();
    }

    return removed;
  }

  /**
   * Update user role in a business (remove old, add new)
   */
  async updateRole(
    userId: string,
    oldRole: Role,
    newRole: Role,
    businessId: string
  ): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    // Remove old role
    await enforcer.removeGroupingPolicy(userId, oldRole, businessId);

    // Add new role
    const added = await enforcer.addGroupingPolicy(userId, newRole, businessId);

    if (added) {
      await enforcer.savePolicy();
    }

    return added;
  }

  /**
   * Assign user type (superadmin, admin, customer)
   */
  async assignUserType(userId: string, userType: UserType): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    // Add grouping policy g2: user, userType
    const added = await enforcer.addNamedGroupingPolicy("g2", userId, userType);

    if (added) {
      await enforcer.savePolicy();
    }

    return added;
  }

  /**
   * Remove user type
   */
  async removeUserType(userId: string, userType: UserType): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    const removed = await enforcer.removeNamedGroupingPolicy("g2", userId, userType);

    if (removed) {
      await enforcer.savePolicy();
    }

    return removed;
  }

  /**
   * Add a policy rule (role permission)
   */
  async addPolicy(policy: PolicyRule): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    const { role, businessId, resource, action } = policy;

    const added = await enforcer.addPolicy(role, businessId, resource, action);

    if (added) {
      await enforcer.savePolicy();
    }

    return added;
  }

  /**
   * Remove a policy rule
   */
  async removePolicy(policy: PolicyRule): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    const { role, businessId, resource, action } = policy;

    const removed = await enforcer.removePolicy(role, businessId, resource, action);

    if (removed) {
      await enforcer.savePolicy();
    }

    return removed;
  }

  /**
   * Get all roles for a user in a specific business
   */
  async getRolesForUserInBusiness(
    userId: string,
    businessId: string
  ): Promise<string[]> {
    const enforcer = await this.getEnforcer();

    // Get all roles for user
    const allRoles = await enforcer.getImplicitRolesForUser(userId, businessId);

    return allRoles;
  }

  /**
   * Get all users with a specific role in a business
   */
  async getUsersForRoleInBusiness(
    role: Role,
    businessId: string
  ): Promise<string[]> {
    const enforcer = await this.getEnforcer();

    const users = await enforcer.getFilteredGroupingPolicy(1, role, businessId);

    return users.map((user) => user[0]);
  }

  /**
   * Remove all roles and permissions for a user in a business
   */
  async removeUserFromBusiness(
    userId: string,
    businessId: string
  ): Promise<boolean> {
    const enforcer = await this.getEnforcer();

    // Remove all grouping policies for this user in this business
    const removed = await enforcer.removeFilteredGroupingPolicy(
      0,
      userId,
      "",
      businessId
    );

    if (removed) {
      await enforcer.savePolicy();
    }

    return removed;
  }

  /**
   * Initialize default policies for roles
   */
  async initializeDefaultPolicies(): Promise<void> {
    const enforcer = await this.getEnforcer();

    // MANAGER permissions (can do everything)
    const managerPolicies = [
      [Role.MANAGER, "*", Resource.BUSINESS, Action.READ],
      [Role.MANAGER, "*", Resource.BUSINESS, Action.UPDATE],
      [Role.MANAGER, "*", Resource.EMPLOYEE, Action.CREATE],
      [Role.MANAGER, "*", Resource.EMPLOYEE, Action.READ],
      [Role.MANAGER, "*", Resource.EMPLOYEE, Action.UPDATE],
      [Role.MANAGER, "*", Resource.EMPLOYEE, Action.DELETE],
      [Role.MANAGER, "*", Resource.APPOINTMENT, Action.CREATE],
      [Role.MANAGER, "*", Resource.APPOINTMENT, Action.READ],
      [Role.MANAGER, "*", Resource.APPOINTMENT, Action.UPDATE],
      [Role.MANAGER, "*", Resource.APPOINTMENT, Action.DELETE],
      [Role.MANAGER, "*", Resource.SETTINGS, Action.READ],
      [Role.MANAGER, "*", Resource.SETTINGS, Action.UPDATE],
    ];

    // EMPLOYEE permissions (limited)
    const employeePolicies = [
      [Role.EMPLOYEE, "*", Resource.BUSINESS, Action.READ],
      [Role.EMPLOYEE, "*", Resource.EMPLOYEE, Action.READ],
      [Role.EMPLOYEE, "*", Resource.APPOINTMENT, Action.CREATE],
      [Role.EMPLOYEE, "*", Resource.APPOINTMENT, Action.READ],
      [Role.EMPLOYEE, "*", Resource.APPOINTMENT, Action.UPDATE],
      [Role.EMPLOYEE, "*", Resource.SETTINGS, Action.READ],
    ];

    // Add all policies
    for (const policy of [...managerPolicies, ...employeePolicies]) {
      await enforcer.addPolicy(...policy);
    }

    await enforcer.savePolicy();
  }

  /**
   * Reload policies from database
   */
  async reloadPolicies(): Promise<void> {
    const enforcer = await this.getEnforcer();
    await enforcer.loadPolicy();
  }
}
