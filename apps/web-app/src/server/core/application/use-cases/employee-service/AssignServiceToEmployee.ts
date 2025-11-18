/**
 * Assign Service to Employee Use Case
 *
 * This use case handles assigning a service to an employee.
 *
 * @module core/application/use-cases/employee-service
 */

import { IEmployeeServiceRepository } from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { EmployeeService } from "@/server/core/domain/entities/EmployeeService";
import { logger } from "@/server/lib/logger";

export interface AssignServiceToEmployeeInput {
  businessUserId: string;
  serviceId: string;
  businessId: string;
}

export interface AssignServiceToEmployeeResult {
  success: boolean;
  employeeService?: EmployeeService;
  error?: string;
}

/**
 * Assign Service to Employee Use Case
 *
 * Business logic for assigning a service to an employee:
 * 1. Check if assignment already exists
 * 2. Create domain entity
 * 3. Persist using repository
 */
export class AssignServiceToEmployeeUseCase {
  constructor(
    private readonly employeeServiceRepository: IEmployeeServiceRepository
  ) {}

  async execute(
    input: AssignServiceToEmployeeInput
  ): Promise<AssignServiceToEmployeeResult> {
    try {
      logger.info(
        "AssignServiceToEmployeeUseCase",
        "system",
        `Assigning service ${input.serviceId} to employee ${input.businessUserId}`
      );

      // 1. Check if assignment already exists
      const exists = await this.employeeServiceRepository.exists(
        input.businessUserId,
        input.serviceId
      );

      if (exists) {
        logger.warning(
          "AssignServiceToEmployeeUseCase",
          "system",
          `Assignment already exists for employee ${input.businessUserId} and service ${input.serviceId}`
        );
        return {
          success: false,
          error: "This service is already assigned to this employee",
        };
      }

      // 2. Create domain entity
      logger.info(
        "AssignServiceToEmployeeUseCase",
        "system",
        "Creating EmployeeService domain entity"
      );

      const employeeService = new EmployeeService({
        businessUserId: input.businessUserId,
        serviceId: input.serviceId,
        businessId: input.businessId,
      });

      // 3. Persist using repository
      logger.info(
        "AssignServiceToEmployeeUseCase",
        "system",
        "Persisting employee service assignment to database"
      );

      const createdAssignment =
        await this.employeeServiceRepository.assign(employeeService);

      logger.info(
        "AssignServiceToEmployeeUseCase",
        "system",
        `Successfully assigned service ${input.serviceId} to employee ${input.businessUserId}`
      );

      return {
        success: true,
        employeeService: createdAssignment,
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          "AssignServiceToEmployeeUseCase",
          "system",
          `Error assigning service: ${error.message}`
        );
        return {
          success: false,
          error: error.message,
        };
      }

      logger.fatal(
        "AssignServiceToEmployeeUseCase",
        "system",
        `Unexpected error: ${String(error)}`
      );
      return {
        success: false,
        error: "An unexpected error occurred while assigning the service",
      };
    }
  }
}
