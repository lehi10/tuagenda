/**
 * Assign Multiple Services to Employee Use Case
 *
 * This use case handles assigning multiple services to an employee at once,
 * replacing all existing assignments.
 *
 * @module core/application/use-cases/employee-service
 */

import { IEmployeeServiceRepository } from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { EmployeeService } from "@/server/core/domain/entities/EmployeeService";
import { logger } from "@/server/lib/logger";

export interface AssignMultipleServicesToEmployeeInput {
  businessUserId: string;
  serviceIds: string[];
  businessId: string;
}

export interface AssignMultipleServicesToEmployeeResult {
  success: boolean;
  employeeServices?: EmployeeService[];
  error?: string;
}

/**
 * Assign Multiple Services to Employee Use Case
 *
 * Business logic for assigning multiple services to an employee:
 * 1. Create domain entities for each assignment
 * 2. Remove all existing assignments and create new ones
 */
export class AssignMultipleServicesToEmployeeUseCase {
  constructor(
    private readonly employeeServiceRepository: IEmployeeServiceRepository
  ) {}

  async execute(
    input: AssignMultipleServicesToEmployeeInput
  ): Promise<AssignMultipleServicesToEmployeeResult> {
    try {
      logger.info(
        "AssignMultipleServicesToEmployeeUseCase",
        "system",
        `Assigning ${input.serviceIds.length} services to employee ${input.businessUserId}`
      );

      // 1. Create domain entities for each assignment
      logger.info(
        "AssignMultipleServicesToEmployeeUseCase",
        "system",
        "Creating EmployeeService domain entities"
      );

      const employeeServices = input.serviceIds.map(
        (serviceId) =>
          new EmployeeService({
            businessUserId: input.businessUserId,
            serviceId,
            businessId: input.businessId,
          })
      );

      // 2. Persist using repository (replaces all existing)
      logger.info(
        "AssignMultipleServicesToEmployeeUseCase",
        "system",
        "Persisting employee service assignments to database"
      );

      const createdAssignments =
        await this.employeeServiceRepository.assignMultiple(employeeServices);

      logger.info(
        "AssignMultipleServicesToEmployeeUseCase",
        "system",
        `Successfully assigned ${createdAssignments.length} services to employee ${input.businessUserId}`
      );

      return {
        success: true,
        employeeServices: createdAssignments,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "AssignMultipleServicesToEmployeeUseCase",
          "system",
          `Error assigning services: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "AssignMultipleServicesToEmployeeUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while assigning services",
      };
    }
  }
}
