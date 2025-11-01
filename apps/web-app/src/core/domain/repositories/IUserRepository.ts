/**
 * User Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for user persistence without specifying implementation.
 * The infrastructure layer will provide concrete implementations (adapters).
 *
 * @module core/domain/repositories
 */

import { User, UserStatus, UserType } from "../entities/User";

export interface IUserRepository {
  /**
   * Find a user by their ID (Firebase UID)
   * @param id - User ID (Firebase UID)
   * @returns User entity or null if not found
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by their email
   * @param email - User email
   * @returns User entity or null if not found
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Find multiple users by their IDs
   * @param ids - Array of user IDs
   * @returns Array of User entities
   */
  findByIds(ids: string[]): Promise<User[]>;

  /**
   * Find all users with optional filtering
   * @param filters - Optional filters
   * @returns Array of User entities
   */
  findAll(filters?: UserRepositoryFilters): Promise<User[]>;

  /**
   * Create a new user
   * @param user - User entity to create
   * @returns Created User entity
   */
  create(user: User): Promise<User>;

  /**
   * Update an existing user
   * @param user - User entity with updated data
   * @returns Updated User entity
   */
  update(user: User): Promise<User>;

  /**
   * Delete a user by ID
   * @param id - User ID to delete
   * @returns void
   */
  delete(id: string): Promise<void>;

  /**
   * Check if a user exists by ID
   * @param id - User ID
   * @returns true if user exists, false otherwise
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if an email is already taken
   * @param email - Email to check
   * @returns true if email exists, false otherwise
   */
  emailExists(email: string): Promise<boolean>;

  /**
   * Count total users with optional filters
   * @param filters - Optional filters
   * @returns Total count of users
   */
  count(filters?: UserRepositoryFilters): Promise<number>;
}

/**
 * Filters for querying users
 */
export interface UserRepositoryFilters {
  status?: UserStatus | UserStatus[];
  type?: UserType | UserType[];
  search?: string; // Search in name, email, etc.
  createdAfter?: Date;
  createdBefore?: Date;
  limit?: number;
  offset?: number;
}
