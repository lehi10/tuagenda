/**
 * Get Service Employees Use Case
 *
 * This use case retrieves all employees assigned to a service.
 *
 * @module core/application/use-cases/employee-service
 */

import {
  IEmployeeServiceRepository,
  ServiceWithEmployees,
} from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { logger } from "@/server/lib/logger";

export interface GetServiceEmployeesInput {
  serviceId: string;
}

export interface GetServiceEmployeesResult {
  success: boolean;
  data?: ServiceWithEmployees;
  error?: string;
}

/**
 * Get Service Employees Use Case
 *
 * Business logic for retrieving all employees assigned to a service
 */
export class GetServiceEmployeesUseCase {
  constructor(
    private readonly employeeServiceRepository: IEmployeeServiceRepository
  ) {}

  async execute(
    input: GetServiceEmployeesInput
  ): Promise<GetServiceEmployeesResult> {
    try {
      logger.info(
        "GetServiceEmployeesUseCase",
        "system",
        `Getting employees for service ${input.serviceId}`
      );

      const data = await this.employeeServiceRepository.findEmployeesByService(
        input.serviceId
      );

      logger.info(
        "GetServiceEmployeesUseCase",
        "system",
        `Found ${data.employees.length} employees for service ${input.serviceId}`
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "GetServiceEmployeesUseCase",
          "system",
          `Error getting service employees: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "GetServiceEmployeesUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while getting service employees",
      };
    }
  }
}
