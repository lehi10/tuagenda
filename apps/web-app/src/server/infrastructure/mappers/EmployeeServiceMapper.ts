/**
 * EmployeeService Mapper
 *
 * Maps between Prisma EmployeeService model and Domain EmployeeService entity.
 * This keeps the domain independent from infrastructure concerns.
 *
 * @module infrastructure/mappers
 */

import { EmployeeService as PrismaEmployeeService } from "db";
import { EmployeeService } from "@/server/core/domain/entities/EmployeeService";

export class EmployeeServiceMapper {
  /**
   * Convert Prisma EmployeeService model to Domain EmployeeService entity
   */
  static toDomain(
    prismaEmployeeService: PrismaEmployeeService
  ): EmployeeService {
    return new EmployeeService({
      businessUserId: prismaEmployeeService.businessUserId,
      serviceId: prismaEmployeeService.serviceId,
      businessId: prismaEmployeeService.businessId,
      createdAt: prismaEmployeeService.createdAt,
      updatedAt: prismaEmployeeService.updatedAt,
    });
  }

  /**
   * Convert Domain EmployeeService entity to Prisma creation data
   */
  static toPrismaCreate(employeeService: EmployeeService) {
    const obj = employeeService.toObject();
    return {
      businessUserId: obj.businessUserId,
      serviceId: obj.serviceId,
      businessId: obj.businessId,
    };
  }

  /**
   * Convert array of Prisma EmployeeServices to array of Domain EmployeeServices
   */
  static toDomainList(
    prismaEmployeeServices: PrismaEmployeeService[]
  ): EmployeeService[] {
    return prismaEmployeeServices.map((prismaES) => this.toDomain(prismaES));
  }
}
