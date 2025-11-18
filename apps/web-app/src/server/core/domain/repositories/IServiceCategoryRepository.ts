/**
 * Service Category Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for service category persistence operations.
 * The domain layer depends on this interface, not any concrete implementation.
 *
 * @module core/domain/repositories
 */

import { ServiceCategory } from "../entities/ServiceCategory";

export interface ServiceCategoryRepositoryFilters {
  businessId: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface IServiceCategoryRepository {
  /**
   * Find a service category by ID
   */
  findById(id: string): Promise<ServiceCategory | null>;

  /**
   * Find all service categories for a business
   */
  findByBusinessId(
    businessId: string,
    filters?: Omit<ServiceCategoryRepositoryFilters, "businessId">
  ): Promise<ServiceCategory[]>;

  /**
   * Find a service category by name within a business
   */
  findByName(businessId: string, name: string): Promise<ServiceCategory | null>;

  /**
   * Create a new service category
   */
  create(category: ServiceCategory): Promise<ServiceCategory>;

  /**
   * Update an existing service category
   */
  update(category: ServiceCategory): Promise<ServiceCategory>;

  /**
   * Delete a service category by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a service category exists by ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if a category name is already taken within a business
   */
  nameExists(
    businessId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean>;

  /**
   * Count total service categories for a business
   */
  count(businessId: string): Promise<number>;
}
