import type { PrismaClient } from "@prisma/client";
import type { IEmployeeAvailabilityRepository } from "@/server/core/domain/repositories/IEmployeeAvailabilityRepository";
import type { EmployeeAvailability } from "@/server/core/domain/entities";
import { EmployeeAvailabilityMapper } from "../mappers/EmployeeAvailabilityMapper";

export class PrismaEmployeeAvailabilityRepository
  implements IEmployeeAvailabilityRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    availability: EmployeeAvailability
  ): Promise<EmployeeAvailability> {
    const data = EmployeeAvailabilityMapper.toPrisma(availability);
    const created = await this.prisma.employeeAvailability.create({ data });
    return EmployeeAvailabilityMapper.toDomain(created);
  }

  async update(
    availability: EmployeeAvailability
  ): Promise<EmployeeAvailability> {
    const data = EmployeeAvailabilityMapper.toPrisma(availability);
    const updated = await this.prisma.employeeAvailability.update({
      where: { id: availability.id },
      data,
    });
    return EmployeeAvailabilityMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employeeAvailability.delete({ where: { id } });
  }

  async findById(id: string): Promise<EmployeeAvailability | null> {
    const found = await this.prisma.employeeAvailability.findUnique({
      where: { id },
    });
    return found ? EmployeeAvailabilityMapper.toDomain(found) : null;
  }

  async findByEmployee(
    businessUserId: string
  ): Promise<EmployeeAvailability[]> {
    const found = await this.prisma.employeeAvailability.findMany({
      where: { businessUserId },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    });
    return EmployeeAvailabilityMapper.toDomainArray(found);
  }

  async findByEmployeeAndDay(
    businessUserId: string,
    dayOfWeek: number
  ): Promise<EmployeeAvailability[]> {
    const found = await this.prisma.employeeAvailability.findMany({
      where: { businessUserId, dayOfWeek },
      orderBy: { startTime: "asc" },
    });
    return EmployeeAvailabilityMapper.toDomainArray(found);
  }

  async deleteByEmployee(businessUserId: string): Promise<void> {
    await this.prisma.employeeAvailability.deleteMany({
      where: { businessUserId },
    });
  }

  async setEmployeeAvailability(
    businessUserId: string,
    businessId: string,
    availabilities: EmployeeAvailability[]
  ): Promise<EmployeeAvailability[]> {
    // Delete existing availabilities and create new ones in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
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
