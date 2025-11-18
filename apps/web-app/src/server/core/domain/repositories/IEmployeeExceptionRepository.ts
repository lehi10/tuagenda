import type { EmployeeException } from "../entities";

export interface IEmployeeExceptionRepository {
  create(exception: EmployeeException): Promise<EmployeeException>;
  update(exception: EmployeeException): Promise<EmployeeException>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<EmployeeException | null>;
  findByEmployee(businessUserId: string): Promise<EmployeeException[]>;
  findByEmployeeAndDate(
    businessUserId: string,
    date: Date
  ): Promise<EmployeeException[]>;
  findByEmployeeDateRange(
    businessUserId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EmployeeException[]>;
  deleteByEmployee(businessUserId: string): Promise<void>;
}
