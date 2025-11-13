/**
 * Business Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for business persistence without specifying implementation.
 * The infrastructure layer will provide concrete implementations (adapters).
 *
 * @module core/domain/repositories
 */

import { Business, BusinessStatus } from "../entities/Business";

export interface IBusinessRepository {
  /**
   * Find a business by its ID
   * @param id - Business ID
   * @returns Business entity or null if not found
   */
  findById(_id: string): Promise<Business | null>;

  /**
   * Find a business by its slug
   * @param slug - Business slug
   * @returns Business entity or null if not found
   */
  findBySlug(_slug: string): Promise<Business | null>;

  /**
   * Find multiple businesses by their IDs
   * @param ids - Array of business IDs
   * @returns Array of Business entities
   */
  findByIds(_ids: string[]): Promise<Business[]>;

  /**
   * Find all businesses with optional filtering
   * @param filters - Optional filters
   * @returns Array of Business entities
   */
  findAll(_filters?: BusinessRepositoryFilters): Promise<Business[]>;

  /**
   * Create a new business
   * @param business - Business entity to create
   * @returns Created Business entity with ID
   */
  create(_business: Business): Promise<Business>;

  /**
   * Update an existing business
   * @param business - Business entity with updated data
   * @returns Updated Business entity
   */
  update(_business: Business): Promise<Business>;

  /**
   * Delete a business by ID
   * @param id - Business ID to delete
   * @returns void
   */
  delete(_id: string): Promise<void>;

  /**
   * Check if a business exists by ID
   * @param id - Business ID
   * @returns true if business exists, false otherwise
   */
  exists(_id: string): Promise<boolean>;

  /**
   * Check if a slug is already taken
   * @param slug - Slug to check
   * @param excludeId - Optional ID to exclude from check (for updates)
   * @returns true if slug exists, false otherwise
   */
  slugExists(_slug: string, _excludeId?: string): Promise<boolean>;

  /**
   * Count total businesses with optional filters
   * @param filters - Optional filters
   * @returns Total count of businesses
   */
  count(_filters?: BusinessRepositoryFilters): Promise<number>;
}

/**
 * Filters for querying businesses
 */
export interface BusinessRepositoryFilters {
  status?: BusinessStatus | BusinessStatus[];
  search?: string; // Search in title, email, city, etc.
  city?: string;
  country?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
}
