/**
 * Employee Service Use Cases
 *
 * Export all employee-service assignment use cases from this file
 */

export {
  AssignServiceToEmployeeUseCase,
  type AssignServiceToEmployeeInput,
  type AssignServiceToEmployeeResult,
} from "./AssignServiceToEmployee";

export {
  UnassignServiceFromEmployeeUseCase,
  type UnassignServiceFromEmployeeInput,
  type UnassignServiceFromEmployeeResult,
} from "./UnassignServiceFromEmployee";

export {
  GetEmployeeServicesUseCase,
  type GetEmployeeServicesInput,
  type GetEmployeeServicesResult,
} from "./GetEmployeeServices";

export {
  GetServiceEmployeesUseCase,
  type GetServiceEmployeesInput,
  type GetServiceEmployeesResult,
} from "./GetServiceEmployees";

export {
  AssignMultipleServicesToEmployeeUseCase,
  type AssignMultipleServicesToEmployeeInput,
  type AssignMultipleServicesToEmployeeResult,
} from "./AssignMultipleServicesToEmployee";
