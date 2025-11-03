/**
 * BusinessUser Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for business-user relationship persistence without specifying implementation.
 * The infrastructure layer will provide concrete implementations (adapters).
 *
 * @module core/domain/repositories
 */

import { BusinessUser, BusinessRole } from "../entities/BusinessUser";

export interface IBusinessUserRepository {
  /**
   * Find a business-user relationship by ID
   * @param id - BusinessUser ID
   * @returns BusinessUser entity or null if not found
   */
  findById(id: number): Promise<BusinessUser | null>;

  /**
   * Find a business-user relationship by user and business IDs
   * @param userId - User ID (Firebase UID)
   * @param businessId - Business ID
   * @returns BusinessUser entity or null if not found
   */
  findByUserAndBusiness(
    userId: string,
    businessId: number
  ): Promise<BusinessUser | null>;

  /**
   * Find all users associated with a business
   * @param businessId - Business ID
   * @param filters - Optional filters
   * @returns Array of BusinessUser entities
   */
  findByBusiness(
    businessId: number,
    filters?: BusinessUserRepositoryFilters
  ): Promise<BusinessUser[]>;

  /**
   * Find all businesses associated with a user
   * @param userId - User ID (Firebase UID)
   * @param filters - Optional filters
   * @returns Array of BusinessUser entities
   */
  findByUser(
    userId: string,
    filters?: BusinessUserRepositoryFilters
  ): Promise<BusinessUser[]>;

  /**
   * Create a new business-user relationship
   * @param businessUser - BusinessUser entity to create
   * @returns Created BusinessUser entity
   */
  create(businessUser: BusinessUser): Promise<BusinessUser>;

  /**
   * Update an existing business-user relationship
   * @param businessUser - BusinessUser entity with updated data
   * @returns Updated BusinessUser entity
   */
  update(businessUser: BusinessUser): Promise<BusinessUser>;

  /**
   * Delete a business-user relationship by ID
   * @param id - BusinessUser ID to delete
   * @returns void
   */
  delete(id: number): Promise<void>;

  /**
   * Delete a business-user relationship by user and business IDs
   * @param userId - User ID (Firebase UID)
   * @param businessId - Business ID
   * @returns void
   */
  deleteByUserAndBusiness(userId: string, businessId: number): Promise<void>;

  /**
   * Check if a business-user relationship exists
   * @param userId - User ID (Firebase UID)
   * @param businessId - Business ID
   * @returns true if relationship exists, false otherwise
   */
  exists(userId: string, businessId: number): Promise<boolean>;

  /**
   * Count total business-user relationships with optional filters
   * @param filters - Optional filters
   * @returns Total count of relationships
   */
  count(filters?: BusinessUserRepositoryFilters): Promise<number>;

  /**
   * Get all managers for a business
   * @param businessId - Business ID
   * @returns Array of BusinessUser entities with MANAGER role
   */
  findManagersByBusiness(businessId: number): Promise<BusinessUser[]>;

  /**
   * Get all employees for a business
   * @param businessId - Business ID
   * @returns Array of BusinessUser entities with EMPLOYEE role
   */
  findEmployeesByBusiness(businessId: number): Promise<BusinessUser[]>;
}

/**
 * Filters for querying business-user relationships
 */
export interface BusinessUserRepositoryFilters {
  role?: BusinessRole | BusinessRole[];
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
}
