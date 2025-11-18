import type { EmployeeAvailability } from "../entities";

export interface IEmployeeAvailabilityRepository {
  create(availability: EmployeeAvailability): Promise<EmployeeAvailability>;
  update(availability: EmployeeAvailability): Promise<EmployeeAvailability>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<EmployeeAvailability | null>;
  findByEmployee(businessUserId: string): Promise<EmployeeAvailability[]>;
  findByEmployeeAndDay(
    businessUserId: string,
    dayOfWeek: number
  ): Promise<EmployeeAvailability[]>;
  deleteByEmployee(businessUserId: string): Promise<void>;
  setEmployeeAvailability(
    businessUserId: string,
    businessId: string,
    availabilities: EmployeeAvailability[]
  ): Promise<EmployeeAvailability[]>;
}
