/**
 * Get Employee Services Use Case
 *
 * This use case retrieves all services assigned to an employee.
 *
 * @module core/application/use-cases/employee-service
 */

import {
  IEmployeeServiceRepository,
  EmployeeWithServices,
} from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { logger } from "@/server/lib/logger";

export interface GetEmployeeServicesInput {
  businessUserId: string;
}

export interface GetEmployeeServicesResult {
  success: boolean;
  data?: EmployeeWithServices;
  error?: string;
}

/**
 * Get Employee Services Use Case
 *
 * Business logic for retrieving all services assigned to an employee
 */
export class GetEmployeeServicesUseCase {
  constructor(
    private readonly employeeServiceRepository: IEmployeeServiceRepository
  ) {}

  async execute(
    input: GetEmployeeServicesInput
  ): Promise<GetEmployeeServicesResult> {
    try {
      logger.info(
        "GetEmployeeServicesUseCase",
        "system",
        `Getting services for employee ${input.businessUserId}`
      );

      const data = await this.employeeServiceRepository.findServicesByEmployee(
        input.businessUserId
      );

      logger.info(
        "GetEmployeeServicesUseCase",
        "system",
        `Found ${data.services.length} services for employee ${input.businessUserId}`
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetEmployeeServicesUseCase",
          "system",
          `Error getting employee services: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetEmployeeServicesUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while getting employee services",
      };
    }
  }
}
