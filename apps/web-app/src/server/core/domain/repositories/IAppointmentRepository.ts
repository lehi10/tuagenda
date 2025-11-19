/**
 * Appointment Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for appointment persistence without specifying implementation.
 * The infrastructure layer will provide concrete implementations (adapters).
 *
 * @module core/domain/repositories
 */

import { Appointment, AppointmentStatus } from "../entities/Appointment";

export interface IAppointmentRepository {
  /**
   * Find an appointment by its ID
   * @param id - Appointment ID
   * @returns Appointment entity or null if not found
   */
  findById(_id: string): Promise<Appointment | null>;

  /**
   * Find upcoming appointments for a customer
   * @param customerId - Customer ID
   * @param businessId - Optional business ID filter
   * @returns Array of Appointment entities ordered by startTime (ascending)
   */
  findUpcomingByCustomer(
    _customerId: string,
    _businessId?: string
  ): Promise<Appointment[]>;

  /**
   * Find past appointments for a customer
   * @param customerId - Customer ID
   * @param businessId - Optional business ID filter
   * @returns Array of Appointment entities ordered by startTime (descending)
   */
  findPastByCustomer(
    _customerId: string,
    _businessId?: string
  ): Promise<Appointment[]>;

  /**
   * Find all appointments with optional filtering
   * @param filters - Optional filters
   * @returns Array of Appointment entities
   */
  findAll(_filters?: AppointmentRepositoryFilters): Promise<Appointment[]>;

  /**
   * Create a new appointment
   * @param appointment - Appointment entity to create
   * @returns Created Appointment entity with ID
   */
  create(_appointment: Appointment): Promise<Appointment>;

  /**
   * Update an existing appointment
   * @param appointment - Appointment entity with updated data
   * @returns Updated Appointment entity
   */
  update(_appointment: Appointment): Promise<Appointment>;

  /**
   * Delete an appointment by ID
   * @param id - Appointment ID to delete
   * @returns void
   */
  delete(_id: string): Promise<void>;

  /**
   * Count total appointments with optional filters
   * @param filters - Optional filters
   * @returns Total count of appointments
   */
  count(_filters?: AppointmentRepositoryFilters): Promise<number>;
}

/**
 * Filters for querying appointments
 */
export interface AppointmentRepositoryFilters {
  customerId?: string;
  providerBusinessUserId?: string;
  businessId?: string;
  serviceId?: string;
  status?: AppointmentStatus | AppointmentStatus[];
  startAfter?: Date;
  startBefore?: Date;
  limit?: number;
  offset?: number;
}
