/**
 * Unassign Service from Employee Use Case
 *
 * This use case handles removing a service assignment from an employee.
 *
 * @module core/application/use-cases/employee-service
 */

import { IEmployeeServiceRepository } from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { logger } from "@/server/lib/logger";

export interface UnassignServiceFromEmployeeInput {
  businessUserId: string;
  serviceId: string;
}

export interface UnassignServiceFromEmployeeResult {
  success: boolean;
  error?: string;
}

/**
 * Unassign Service from Employee Use Case
 *
 * Business logic for unassigning a service from an employee:
 * 1. Check if assignment exists
 * 2. Remove the assignment
 */
export class UnassignServiceFromEmployeeUseCase {
  constructor(
    private readonly employeeServiceRepository: IEmployeeServiceRepository
  ) {}

  async execute(
    input: UnassignServiceFromEmployeeInput
  ): Promise<UnassignServiceFromEmployeeResult> {
    try {
      logger.info(
        "UnassignServiceFromEmployeeUseCase",
        "system",
        `Unassigning service ${input.serviceId} from employee ${input.businessUserId}`
      );

      // 1. Check if assignment exists
      const exists = await this.employeeServiceRepository.exists(
        input.businessUserId,
        input.serviceId
      );

      if (!exists) {
        logger.warning(
          "UnassignServiceFromEmployeeUseCase",
          "system",
          `Assignment does not exist for employee ${input.businessUserId} and service ${input.serviceId}`
        );
        return {
          success: false,
          error: "This service is not assigned to this employee",
        };
      }

      // 2. Remove the assignment
      await this.employeeServiceRepository.unassign(
        input.businessUserId,
        input.serviceId
      );

      logger.info(
        "UnassignServiceFromEmployeeUseCase",
        "system",
        `Successfully unassigned service ${input.serviceId} from employee ${input.businessUserId}`
      );

      return {
        success: true,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "UnassignServiceFromEmployeeUseCase",
          "system",
          `Error unassigning service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "UnassignServiceFromEmployeeUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while unassigning the service",
      };
    }
  }
}
