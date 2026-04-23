/**
 * Prisma Employee Service Repository (Adapter)
 *
 * This is an ADAPTER in hexagonal architecture.
 * It implements the IEmployeeServiceRepository port using Prisma as the persistence mechanism.
 * The domain layer depends on the interface, not this implementation.
 *
 * @module infrastructure/repositories
 */

import { prisma } from "db";
import {
  IEmployeeServiceRepository,
  EmployeeWithServices,
  ServiceWithEmployees,
} from "@/server/core/domain/repositories/IEmployeeServiceRepository";
import { EmployeeService } from "@/server/core/domain/entities/EmployeeService";
import { EmployeeServiceMapper } from "../mappers/EmployeeServiceMapper";

export class PrismaEmployeeServiceRepository
  implements IEmployeeServiceRepository
{
  /**
   * Assign a service to an employee
   */
  async assign(employeeService: EmployeeService): Promise<EmployeeService> {
    const data = EmployeeServiceMapper.toPrismaCreate(employeeService);

    const created = await prisma.employeeService.create({
      data,
    });

    return EmployeeServiceMapper.toDomain(created);
  }

  /**
   * Unassign a service from an employee
   */
  async unassign(businessUserId: string, serviceId: string): Promise<void> {
    await prisma.employeeService.delete({
      where: {
        businessUserId_serviceId: {
          businessUserId,
          serviceId,
        },
      },
    });
  }

  /**
   * Get all services assigned to an employee
   */
  async findServicesByEmployee(
    businessUserId: string
  ): Promise<EmployeeWithServices> {
    const assignments = await prisma.employeeService.findMany({
      where: { businessUserId },
      include: {
        service: true,
      },
      orderBy: {
        service: {
          name: "asc",
        },
      },
    });

    return {
      businessUserId,
      services: assignments.map((a) => ({
        id: a.service.id,
        name: a.service.name,
        description: a.service.description,
        price: a.service.price.toNumber(),
        durationMinutes: a.service.durationMinutes,
        active: a.service.active,
      })),
    };
  }

  /**
   * Get all employees assigned to a service
   */
  async findEmployeesByService(
    serviceId: string
  ): Promise<ServiceWithEmployees> {
    const assignments = await prisma.employeeService.findMany({
      where: {
        serviceId,
        businessUser: { isActive: true },
      },
      include: {
        businessUser: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        businessUser: {
          user: {
            firstName: "asc",
          },
        },
      },
    });

    return {
      serviceId,
      employees: assignments.map((a) => ({
        id: a.businessUser.id,
        userId: a.businessUser.userId,
        displayName: a.businessUser.displayName,
        user: {
          id: a.businessUser.user.id,
          firstName: a.businessUser.user.firstName,
          lastName: a.businessUser.user.lastName,
          email: a.businessUser.user.email,
          avatarUrl: a.businessUser.user.pictureFullPath,
        },
      })),
    };
  }

  /**
   * Check if an assignment exists
   */
  async exists(businessUserId: string, serviceId: string): Promise<boolean> {
    const count = await prisma.employeeService.count({
      where: {
        businessUserId,
        serviceId,
      },
    });

    return count > 0;
  }

  /**
   * Assign multiple services to an employee (replaces all existing assignments)
   */
  async assignMultiple(
    employeeServices: EmployeeService[]
  ): Promise<EmployeeService[]> {
    if (employeeServices.length === 0) {
      return [];
    }

    // Get businessUserId from the first entity (all should have the same)
    const businessUserId = employeeServices[0].businessUserId;

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing assignments for this employee
      await tx.employeeService.deleteMany({
        where: { businessUserId },
      });

      // Create new assignments
      const dataToCreate = employeeServices.map((es) =>
        EmployeeServiceMapper.toPrismaCreate(es)
      );

      await tx.employeeService.createMany({
        data: dataToCreate,
      });

      // Fetch the created assignments
      const assignments = await tx.employeeService.findMany({
        where: { businessUserId },
      });

      return EmployeeServiceMapper.toDomainList(assignments);
    });

    return result;
  }

  /**
   * Delete all assignments for an employee
   */
  async deleteAllByEmployee(businessUserId: string): Promise<void> {
    await prisma.employeeService.deleteMany({
      where: { businessUserId },
    });
  }

  /**
   * Delete all assignments for a service
   */
  async deleteAllByService(serviceId: string): Promise<void> {
    await prisma.employeeService.deleteMany({
      where: { serviceId },
    });
  }
}
