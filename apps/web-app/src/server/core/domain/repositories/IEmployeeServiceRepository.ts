/**
 * Employee Service Repository Interface (Port)
 *
 * This is a PORT in hexagonal architecture.
 * It defines the contract for employee-service assignment operations.
 * The domain layer depends on this interface, not any concrete implementation.
 *
 * @module core/domain/repositories
 */

import { EmployeeService } from "../entities/EmployeeService";

export interface EmployeeWithServices {
  businessUserId: string;
  services: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    durationMinutes: number;
    active: boolean;
  }[];
}

export interface ServiceWithEmployees {
  serviceId: string;
  employees: {
    id: string;
    userId: string;
    displayName: string | null;
    user: {
      id: string;
      firstName: string;
      lastName: string | null;
      email: string;
      avatarUrl: string | null;
    };
  }[];
}

export interface IEmployeeServiceRepository {
  /**
   * Assign a service to an employee
   */
  assign(employeeService: EmployeeService): Promise<EmployeeService>;

  /**
   * Unassign a service from an employee
   */
  unassign(businessUserId: string, serviceId: string): Promise<void>;

  /**
   * Get all services assigned to an employee
   */
  findServicesByEmployee(businessUserId: string): Promise<EmployeeWithServices>;

  /**
   * Get all employees assigned to a service
   */
  findEmployeesByService(serviceId: string): Promise<ServiceWithEmployees>;

  /**
   * Check if an assignment exists
   */
  exists(businessUserId: string, serviceId: string): Promise<boolean>;

  /**
   * Assign multiple services to an employee (replaces all existing assignments)
   */
  assignMultiple(
    employeeServices: EmployeeService[]
  ): Promise<EmployeeService[]>;

  /**
   * Delete all assignments for an employee
   */
  deleteAllByEmployee(businessUserId: string): Promise<void>;

  /**
   * Delete all assignments for a service
   */
  deleteAllByService(serviceId: string): Promise<void>;
}
