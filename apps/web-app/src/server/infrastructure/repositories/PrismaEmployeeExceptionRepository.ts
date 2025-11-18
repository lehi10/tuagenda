import type { PrismaClient } from "@prisma/client";
import type { IEmployeeExceptionRepository } from "@/server/core/domain/repositories/IEmployeeExceptionRepository";
import type { EmployeeException } from "@/server/core/domain/entities";
import { EmployeeExceptionMapper } from "../mappers/EmployeeExceptionMapper";

export class PrismaEmployeeExceptionRepository
  implements IEmployeeExceptionRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(exception: EmployeeException): Promise<EmployeeException> {
    const data = EmployeeExceptionMapper.toPrisma(exception);
    const created = await this.prisma.employeeException.create({ data });
    return EmployeeExceptionMapper.toDomain(created);
  }

  async update(exception: EmployeeException): Promise<EmployeeException> {
    const data = EmployeeExceptionMapper.toPrisma(exception);
    const updated = await this.prisma.employeeException.update({
      where: { id: exception.id },
      data,
    });
    return EmployeeExceptionMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.employeeException.delete({ where: { id } });
  }

  async findById(id: string): Promise<EmployeeException | null> {
    const found = await this.prisma.employeeException.findUnique({
      where: { id },
    });
    return found ? EmployeeExceptionMapper.toDomain(found) : null;
  }

  async findByEmployee(businessUserId: string): Promise<EmployeeException[]> {
    const found = await this.prisma.employeeException.findMany({
      where: { businessUserId },
      orderBy: { date: "desc" },
    });
    return EmployeeExceptionMapper.toDomainArray(found);
  }

  async findByEmployeeAndDate(
    businessUserId: string,
    date: Date
  ): Promise<EmployeeException[]> {
    const found = await this.prisma.employeeException.findMany({
      where: { businessUserId, date },
      orderBy: { startTime: "asc" },
    });
    return EmployeeExceptionMapper.toDomainArray(found);
  }

  async findByEmployeeDateRange(
    businessUserId: string,
    startDate: Date,
    endDate: Date
  ): Promise<EmployeeException[]> {
    const found = await this.prisma.employeeException.findMany({
      where: {
        businessUserId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { date: "asc" },
    });
    return EmployeeExceptionMapper.toDomainArray(found);
  }

  async deleteByEmployee(businessUserId: string): Promise<void> {
    await this.prisma.employeeException.deleteMany({
      where: { businessUserId },
    });
  }
}
