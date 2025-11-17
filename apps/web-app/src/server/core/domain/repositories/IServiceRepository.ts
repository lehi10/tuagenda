/**
 * Service Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for service persistence operations.
 * The domain layer depends on this interface, not any concrete implementation.
 *
 * @module core/domain/repositories
 */

import { Service } from "../entities/Service";

export interface ServiceRepositoryFilters {
  businessId: string;
  categoryId?: string | null;
  active?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  limit?: number;
  offset?: number;
}

export interface IServiceRepository {
  /**
   * Find a service by ID
   */
  findById(id: string): Promise<Service | null>;

  /**
   * Find all services for a business
   */
  findByBusinessId(
    businessId: string,
    filters?: Omit<ServiceRepositoryFilters, "businessId">
  ): Promise<Service[]>;

  /**
   * Find all services in a category
   */
  findByCategoryId(categoryId: string): Promise<Service[]>;

  /**
   * Find a service by name within a business
   */
  findByName(businessId: string, name: string): Promise<Service | null>;

  /**
   * Create a new service
   */
  create(service: Service): Promise<Service>;

  /**
   * Update an existing service
   */
  update(service: Service): Promise<Service>;

  /**
   * Delete a service by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a service exists by ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if a service name is already taken within a business
   */
  nameExists(
    businessId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean>;

  /**
   * Count total services for a business
   */
  count(
    businessId: string,
    filters?: Omit<ServiceRepositoryFilters, "businessId" | "limit" | "offset">
  ): Promise<number>;

  /**
   * Get services by multiple IDs
   */
  findByIds(ids: string[]): Promise<Service[]>;
}
