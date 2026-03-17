import { prisma } from "db";
import type { IEmployeeAvailabilityRepository } from "@/server/core/domain/repositories/IEmployeeAvailabilityRepository";
import type { EmployeeAvailability } from "@/server/core/domain/entities";
import { EmployeeAvailabilityMapper } from "../mappers/EmployeeAvailabilityMapper";

export class PrismaEmployeeAvailabilityRepository
  implements IEmployeeAvailabilityRepository
{
  async create(
    availability: EmployeeAvailability
  ): Promise<EmployeeAvailability> {
    const data = EmployeeAvailabilityMapper.toPrisma(availability);
    const created = await prisma.employeeAvailability.create({ data });
    return EmployeeAvailabilityMapper.toDomain(created);
  }

  async update(
    availability: EmployeeAvailability
  ): Promise<EmployeeAvailability> {
    const data = EmployeeAvailabilityMapper.toPrisma(availability);
    const updated = await prisma.employeeAvailability.update({
      where: { id: availability.id },
      data,
    });
    return EmployeeAvailabilityMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await prisma.employeeAvailability.delete({ where: { id } });
  }

  async findById(id: string): Promise<EmployeeAvailability | null> {
    const found = await prisma.employeeAvailability.findUnique({
      where: { id },
    });
    return found ? EmployeeAvailabilityMapper.toDomain(found) : null;
  }

  async findByEmployee(
    businessUserId: string
  ): Promise<EmployeeAvailability[]> {
    const found = await prisma.employeeAvailability.findMany({
      where: { businessUserId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return EmployeeAvailabilityMapper.toDomainArray(found);
  }

  async findByEmployeeAndDay(
    businessUserId: string,
    dayOfWeek: number
  ): Promise<EmployeeAvailability[]> {
    const found = await prisma.employeeAvailability.findMany({
      where: { businessUserId, dayOfWeek },
      orderBy: { startTime: "asc" },
    });
    return EmployeeAvailabilityMapper.toDomainArray(found);
  }

  async deleteByEmployee(businessUserId: string): Promise<void> {
    await prisma.employeeAvailability.deleteMany({
      where: { businessUserId },
    });
  }

  async setEmployeeAvailability(
    businessUserId: string,
    businessId: string,
    availabilities: EmployeeAvailability[]
  ): Promise<EmployeeAvailability[]> {
    // Delete existing availabilities and create new ones in a transaction
    const result = await prisma.$transaction(async (tx) => {
      await tx.employeeAvailability.deleteMany({
        where: { businessUserId },
      });

      const created = await Promise.all(
        availabilities.map((availability) => {
          const data = EmployeeAvailabilityMapper.toPrisma(availability);
          return tx.employeeAvailability.create({ data });
        })
      );

      return created;
    });

    return EmployeeAvailabilityMapper.toDomainArray(result);
  }
}
